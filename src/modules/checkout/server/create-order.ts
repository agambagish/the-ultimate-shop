"use server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/db";
import type { Order, Product } from "@/db/schema";
import { orders, ordersItems } from "@/db/schema";
import { tryCatch } from "@/lib/try-catch";

type CartItem = Pick<
  Product,
  "title" | "slug" | "price" | "discountPercentage" | "thumbnailImageURL"
> & {
  category: string;
  storeId: number;
  storeSlug: string;
};

interface Props {
  cart: CartItem[];
  subtotal: string;
  discount: string;
  total: string;
  transactionId: string;
  billingAddress: Pick<
    Order,
    "address" | "city" | "state" | "pinCode" | "country"
  >;
}

export async function createOrder({
  billingAddress,
  cart,
  transactionId,
  subtotal,
  discount,
  total,
}: Props) {
  const session = await auth();

  if (!session.userId) {
    throw new Error("You are not logged in");
  }

  const newOrder = await tryCatch(
    db.transaction(async (tx) => {
      const storeIds = [...new Set(cart.map((item) => item.storeId))];

      if (storeIds.length > 0) {
        const ownStores = await tryCatch(
          tx.query.stores.findMany({
            where: (f, o) =>
              o.and(o.eq(f.userId, session.userId), o.inArray(f.id, storeIds)),
            columns: { id: true },
          })
        );

        if (ownStores.error || ownStores.data.length > 0) {
          throw new Error("You cannot place orders on your own products.");
        }
      }

      const order = await tryCatch(
        tx
          .insert(orders)
          .values({
            userId: session.userId,
            subtotal,
            total,
            discount,
            transactionId,
            ...billingAddress,
          })
          .returning({ id: orders.id })
      );

      if (order.error) {
        throw new Error("Something went wrong, please try again");
      }

      const orderItemPromises = cart.map(async (item) => {
        const [orderItems] = await tx
          .insert(ordersItems)
          .values({
            orderId: order.data[0].id,
            priceAtPurchase: Math.round(
              Number(item.price) -
                (Number(item.price) * item.discountPercentage) / 100
            ).toString(),
            productSlug: item.slug,
            storeSlug: item.storeSlug,
          })
          .returning({ id: ordersItems.id });

        return orderItems.id;
      });

      await Promise.all(orderItemPromises);
      return order.data[0].id;
    })
  );

  if (newOrder.error) {
    throw new Error(
      newOrder.error.message || "Something went wrong, please try again"
    );
  }

  return newOrder.data;
}
