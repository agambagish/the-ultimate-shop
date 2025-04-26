import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { orders, products } from "@/db/schema";
import { validateWebhookResponse } from "@/features/cart/actions";
import { checkoutWebhookSchema } from "@/features/cart/lib/checkout-webhook-schema";
import { tryCatch } from "@/lib/try-catch";
import { pgDecoder } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const fields = [
    "mihpayid",
    "txnid",
    "amount",
    "productinfo",
    "firstname",
    "lastname",
    "address1",
    "address2",
    "city",
    "state",
    "zipcode",
    "country",
    "email",
    "field1",
    "pa_name",
    "key",
    "hash",
    "status",
    "udf1",
    "udf2",
    "udf3",
    "udf4",
    "udf5",
  ];

  const _formData = Object.fromEntries(
    fields.map((field) => [field, formData.get(field)?.toString()])
  );

  const { error, data } = checkoutWebhookSchema.safeParse(_formData);

  if (error) return new NextResponse("unprocessable entity", { status: 200 });

  const isValid = await validateWebhookResponse(data);

  const items = JSON.parse(data.udf1) as { id: number; qty: number }[];

  if (isValid) {
    const newOrderPromise = tryCatch(
      db.insert(orders).values({
        amount: data.amount,
        payuTransactionId: data.mihpayid,
        transactionId: data.txnid,
        name: `${data.firstname} ${data.lastname}`,
        email: data.email,
        userId: data.udf2,
        vpa: data.field1,
        payer: data.pa_name,
        items,
        deliveryAddress: pgDecoder(
          `${data.address1}, ${data.address2}, ${data.city}, ${data.state}, ${data.zipcode}, ${data.country}`
        ),
      })
    );

    const updateProductInventories = items.map((item) => {
      return tryCatch(
        db
          .update(products)
          .set({
            inventory: sql`${products.inventory} - ${item.qty}`,
          })
          .where(eq(products.id, item.id))
      );
    });

    await Promise.all([newOrderPromise, updateProductInventories]);
  }

  return new NextResponse("OK", { status: 200 });
}
