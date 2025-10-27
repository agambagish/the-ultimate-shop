import { TRPCError } from "@trpc/server";
import type { CartItem, OrderEntity, PayOrderEntity } from "cashfree-pg";
import z from "zod";

import { env } from "@/env";
import { calculateProductPricing, calculateTotals } from "@/lib/calculate";
import { cashfree } from "@/lib/cashfree";
import { prisma } from "@/lib/prisma";
import { tryCatch } from "@/lib/try-catch";
import type { StrictDefined } from "@/lib/types";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";

import { cardSchema, upiSchema } from "../lib/schemas";

export const checkoutRouter = createTRPCRouter({
  purchase: protectedProcedure
    .input(
      z.object({
        productIds: z.array(z.string()).min(1),
        storeSubdomain: z.string(),
        credentials: z.discriminatedUnion("type", [
          cardSchema.extend({
            type: z.literal("card"),
          }),
          upiSchema.extend({
            type: z.literal("upi"),
          }),
        ]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const products = await prisma.products.findMany({
        where: {
          AND: [
            { id: { in: input.productIds.map(Number) } },
            { stores: { subdomain: input.storeSubdomain } },
          ],
        },
        select: {
          id: true,
          title: true,
          price: true,
          discount_type: true,
          discount_value: true,
        },
      });

      if (products.length !== input.productIds.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Products not found",
        });
      }

      const store = await prisma.stores.findUnique({
        where: { subdomain: input.storeSubdomain },
        select: { subdomain: true },
      });

      if (!store) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Store not found",
        });
      }

      // TODO: Throw error if CF details not provided

      const cart_items: CartItem[] = products.map((product) => {
        const { discountedPrice: item_discounted_unit_price } =
          calculateProductPricing(product);

        return {
          item_quantity: 1,
          item_original_unit_price: product.price.toNumber(),
          item_discounted_unit_price,
          item_currency: "INR",
          item_name: product.title,
          item_id: product.id.toString(),
          item_details_url: `${env.NEXT_PUBLIC_APP_URL}/stores/${store.subdomain}/products/${product.id}`,
        };
      });

      const { total: order_amount } = calculateTotals(products);
      const order_id = crypto.randomUUID();

      const orderData = await tryCatch(
        cashfree.PGCreateOrder({
          order_id,
          order_amount,
          order_currency: "INR",
          customer_details: {
            customer_id: ctx.session.user.id.toString(),
            customer_name: ctx.session.user.fullname,
            customer_phone: "9876543210",
            customer_email: ctx.session.user.email,
          },
          cart_details: { cart_items },
          order_meta: {
            return_url: `${env.NEXT_PUBLIC_APP_URL}/api/payment/redirect?orderId=${order_id}&subdomain=${input.storeSubdomain}`,
          },
        }),
      );

      if (orderData.error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create order",
        });
      }

      const order = orderData.data.data as StrictDefined<OrderEntity>;

      const paymentData = await tryCatch(
        cashfree.PGPayOrder({
          payment_session_id: order.payment_session_id,
          payment_method: {
            ...(input.credentials.type === "upi"
              ? {
                  upi: {
                    channel: "collect",
                    upi_redirect_url: true,
                    upi_id: input.credentials.vpa,
                  },
                }
              : {
                  card: {
                    channel: "link",
                  },
                }),
          },
        }),
      );

      if (paymentData.error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        });
      }

      const payment = paymentData.data.data as StrictDefined<PayOrderEntity>;

      return { url: payment.data.url };
    }),
  getProducts: baseProcedure
    .input(
      z.object({
        productIds: z.array(z.string()),
        storeSubdomain: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const data = await prisma.products.findMany({
        where: {
          AND: [
            { id: { in: input.productIds.map(Number) } },
            { stores: { subdomain: input.storeSubdomain } },
          ],
        },
        select: {
          id: true,
          title: true,
          image_id: true,
          price: true,
          discount_type: true,
          discount_value: true,
          stores: {
            select: {
              name: true,
              subdomain: true,
            },
          },
        },
      });

      if (data.length !== input.productIds.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Products not found",
        });
      }

      const { subtotal, total, totalSavings } = calculateTotals(data);

      return {
        products: data.map((product) => ({
          ...product,
          price: product.price.toNumber(),
          discount_value: product.discount_value.toNumber(),
        })),
        subtotal,
        totalSavings,
        total,
      };
    }),
});
