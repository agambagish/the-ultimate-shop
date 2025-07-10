"use server";

import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { orders, ordersItems } from "@/db/schema";
import { clerkClient } from "@/lib/clerk";
import { tryCatch } from "@/lib/try-catch";

export async function getRecentOrders(slug: string, limit = 10) {
  const ordersData = await tryCatch(
    db
      .select({
        id: orders.id,
        userId: orders.userId,
        isPaid: orders.isPaid,
        amount: ordersItems.priceAtPurchase,
      })
      .from(ordersItems)
      .innerJoin(orders, eq(orders.id, ordersItems.orderId))
      .where(and(eq(orders.isPaid, true), eq(ordersItems.storeSlug, slug)))
      .limit(limit)
      .orderBy(desc(orders.createdAt))
  );

  if (ordersData.error) return [];

  return Promise.all(
    ordersData.data.map(async ({ id, userId, isPaid, amount }) => {
      const res = await clerkClient.users.getUser(userId);

      return {
        id,
        customer: res.fullName ?? "",
        email: res.primaryEmailAddress?.emailAddress ?? "",
        isPaid,
        amount,
      };
    })
  );
}
