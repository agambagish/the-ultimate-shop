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
};

interface Props {
  cart: CartItem[];
  totalAmount: string;
  transactionId: string;
  billingAddress: Pick<
    Order,
    "address" | "city" | "state" | "pinCode" | "country"
  >;
}

export async function createOrder({
  billingAddress,
  cart,
  totalAmount,
  transactionId,
}: Props) {
  const session = await auth();

  if (!session.userId) {
    throw new Error("You are not logged in");
  }

  const newOrder = await tryCatch(
    db.transaction(async (tx) => {
      const [order] = await tx
        .insert(orders)
        .values({
          userId: session.userId,
          totalAmount,
          transactionId,
          ...billingAddress,
        })
        .returning({ id: orders.id });

      const orderItemPromises = cart.map(async (item) => {
        const [orderItems] = await tx
          .insert(ordersItems)
          .values({
            orderId: order.id,
            priceAtPurchase: String(
              Number(item.price) -
                (Number(item.price) * item.discountPercentage) / 100
            ),
            productSlug: item.slug,
            storeId: item.storeId,
          })
          .returning({ id: ordersItems.id });

        return orderItems.id;
      });

      await Promise.all(orderItemPromises);
      return order.id;
    })
  );

  if (newOrder.error) {
    throw new Error("Something went wrong, please try again");
  }

  return newOrder.data;
}
