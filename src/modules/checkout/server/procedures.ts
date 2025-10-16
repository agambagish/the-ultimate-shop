import { TRPCError } from "@trpc/server";
import type { CartItem } from "cashfree-pg";
import z from "zod";

import { env } from "@/env";
import { calculatePricing } from "@/lib/calculate";
import { cashfree } from "@/lib/cashfree";
import { tryCatch } from "@/lib/try-catch";
import type { Media, Store } from "@/payload-types";
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
      const products = await ctx.payload.find({
        collection: "products",
        select: { content: false },
        depth: 2,
        where: {
          and: [
            { id: { in: input.productIds } },
            {
              "tenant.subdomain": {
                equals: input.storeSubdomain,
              },
            },
          ],
        },
      });

      if (products.totalDocs !== input.productIds.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Products not found",
        });
      }

      const storesData = await ctx.payload.find({
        collection: "stores",
        limit: 1,
        pagination: false,
        where: {
          subdomain: { equals: input.storeSubdomain },
        },
      });

      const store = storesData.docs[0];

      if (!store) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Store not found",
        });
      }

      // TODO: Throw error if CF details not provided

      const cart_items: CartItem[] = products.docs.map((product) => ({
        item_quantity: 1,
        item_original_unit_price: product.price,
        item_discounted_unit_price:
          product.discountType === "flat"
            ? Math.round(product.price - product.discountValue)
            : Math.round(
                product.price - (product.price * product.discountValue) / 100,
              ),
        item_currency: "INR",
        item_name: product.title,
        item_id: product.id.toString(),
        item_details_url: `${env.NEXT_PUBLIC_APP_URL}/stores/${store.subdomain}/products/${product.id}`,
      }));

      const { total: order_amount } = calculatePricing(products.docs);
      const order_id = crypto.randomUUID();

      const { data: order } = await tryCatch(
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

      if (!order?.data.payment_session_id || order.status !== 200) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create order",
        });
      }

      const { data: payment } = await tryCatch(
        cashfree.PGPayOrder({
          payment_session_id: order.data.payment_session_id,
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

      if (!payment?.data.data?.url || payment.status !== 200) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        });
      }

      return { url: payment.data.data.url };
    }),
  getProducts: baseProcedure
    .input(
      z.object({
        productIds: z.array(z.string()),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.payload.find({
        collection: "products",
        select: { content: false },
        depth: 2,
        where: {
          id: { in: input.productIds },
        },
      });

      if (data.totalDocs !== input.productIds.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Products not found",
        });
      }

      const { subtotal, total, totalSavings } = calculatePricing(data.docs);

      return {
        ...data,
        subtotal,
        totalSavings,
        total,
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Store & { avatar: Media | null },
        })),
      };
    }),
});
