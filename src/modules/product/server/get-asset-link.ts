"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { orders, ordersItems } from "@/db/schema";
import { pinata } from "@/lib/pinata";
import { tryCatch } from "@/lib/try-catch";

interface Props {
  slug: string;
  assetCID: string;
}

export async function getAssetLink({ slug, assetCID }: Props) {
  const session = await auth();

  const order = await tryCatch(
    db
      .select({
        id: orders.id,
      })
      .from(orders)
      .innerJoin(
        ordersItems,
        and(
          eq(ordersItems.orderId, orders.id),
          eq(ordersItems.productSlug, slug)
        )
      )
      .where(eq(orders.userId, session.userId ?? ""))
  );

  if (order.error) {
    return null;
  }

  const isPurchased = order.data.length !== 0 ? !!order.data[0].id : false;

  if (!isPurchased) {
    return null;
  }

  const link = await pinata.gateways.private.createAccessLink({
    cid: assetCID,
    expires: 30,
  });

  return link;
}
