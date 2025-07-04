import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import crypto from "crypto";
import { and, eq, lt } from "drizzle-orm";
import { z } from "zod/v4";

import { db } from "@/db";
import { orders } from "@/db/schema";
import { env } from "@/env";
import { tryCatch } from "@/lib/try-catch";
import { hashParamSchema } from "@/modules/checkout/schemas/hash-param-schema";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const formData: Record<string, string> = {};

    for (const [key, value] of form.entries()) {
      formData[key] = typeof value === "string" ? value : "";
    }

    const { data, success } = hashParamSchema
      .omit({
        amount: true,
        phone: true,
      })
      .extend({
        amount: z.string().min(1),
        phone: z.string().min(1),
        status: z.string().min(1),
        hash: z.string().min(1),
      })
      .safeParse(formData);

    if (!success) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const reverseHashString = `${env.PAYU_SALT}|${data.status}||||||${data.udf5}|${data.udf4}|${data.udf3}|${data.udf2}|${data.udf1}|${data.email}|${data.firstname}|${data.productinfo}|${data.amount}|${data.txnid}|${data.key}`;

    const calculatedHash = crypto
      .createHash("sha512")
      .update(reverseHashString)
      .digest("hex");

    if (calculatedHash !== data.hash) {
      return NextResponse.json({ message: "Hash mismatch" }, { status: 400 });
    }

    const isPaid = data.status === "success";

    const updatedOrder = await tryCatch(
      db
        .update(orders)
        .set({
          isPaid,
        })
        .where(eq(orders.transactionId, data.txnid))
    );

    if (updatedOrder.error) {
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Payment verified" });
  } catch {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const token = req.headers.get("AUTH_TOKEN");

  if (token !== env.ORDER_CLEANUP_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - 30 * 60 * 1000);

  const deleted = await tryCatch(
    db
      .delete(orders)
      .where(and(eq(orders.isPaid, false), lt(orders.createdAt, cutoff)))
      .returning({ id: orders.id })
  );

  if (deleted.error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }

  return NextResponse.json({ deletedOrders: deleted.data.length });
}
