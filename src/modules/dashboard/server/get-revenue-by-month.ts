"use server";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { orders, ordersItems } from "@/db/schema";
import { tryCatch } from "@/lib/try-catch";

export async function getRevenueByMonth(slug: string) {
  const paidOrders = await tryCatch(
    db
      .select({
        priceAtPurchase: ordersItems.priceAtPurchase,
        createdAt: ordersItems.createdAt,
      })
      .from(ordersItems)
      .innerJoin(orders, eq(orders.id, ordersItems.orderId))
      .where(and(eq(ordersItems.storeSlug, slug), eq(orders.isPaid, true)))
  );

  if (paidOrders.error) return [];

  const monthlyRevenue: { [key: number]: number } = {};

  for (const order of paidOrders.data) {
    const month = order.createdAt.getMonth();

    monthlyRevenue[month] =
      (monthlyRevenue[month] || 0) + Number(order.priceAtPurchase);
  }

  const graphData = [
    { month: "Jan", revenue: 0 },
    { month: "Feb", revenue: 0 },
    { month: "Mar", revenue: 0 },
    { month: "Apr", revenue: 0 },
    { month: "May", revenue: 0 },
    { month: "Jun", revenue: 0 },
    { month: "Jul", revenue: 0 },
    { month: "Aug", revenue: 0 },
    { month: "Sep", revenue: 0 },
    { month: "Oct", revenue: 0 },
    { month: "Nov", revenue: 0 },
    { month: "Dec", revenue: 0 },
  ];

  for (const month in monthlyRevenue) {
    graphData[Number(month)].revenue = monthlyRevenue[Number(month)];
  }

  return graphData;
}
