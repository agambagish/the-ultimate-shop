"use server";

import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { orders, ordersItems } from "@/db/schema";
import { clerkClient } from "@/lib/clerk";
import { tryCatch } from "@/lib/try-catch";

export async function getCustomersData(slug: string) {
  const ordersData = await tryCatch(
    db
      .select({
        userId: orders.userId,
        address: orders.address,
        city: orders.city,
        state: orders.state,
        pinCode: orders.pinCode,
        country: orders.country,
      })
      .from(ordersItems)
      .innerJoin(orders, eq(orders.id, ordersItems.orderId))
      .where(and(eq(orders.isPaid, true), eq(ordersItems.storeSlug, slug)))
      .orderBy(desc(orders.createdAt))
  );

  if (ordersData.error) return [];

  return Promise.all(
    ordersData.data.map(
      async ({ userId, address, city, state, pinCode, country }) => {
        const res = await clerkClient.users.getUser(userId);

        return {
          fullName: res.fullName ?? "",
          email: res.primaryEmailAddress?.emailAddress ?? "",
          address,
          city,
          state,
          pinCode,
          country,
        };
      }
    )
  );
}
