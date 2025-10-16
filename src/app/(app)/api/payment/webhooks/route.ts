import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import config from "@payload-config";
import type { PaymentWebhookDataEntity, PGWebhookEvent } from "cashfree-pg";
import { getPayload } from "payload";

import { cashfree } from "@/lib/cashfree";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-webhook-signature") || "";
  const timestamp = req.headers.get("x-webhook-timestamp") || "";
  const rawBody = await req.text();

  let event: PGWebhookEvent;

  try {
    event = cashfree.PGVerifyWebhookSignature(signature, rawBody, timestamp);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error";

    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 },
    );
  }

  const permittedEvents: string[] = ["PAYMENT_SUCCESS_WEBHOOK"];

  const payload = await getPayload({ config });

  if (permittedEvents.includes(event.type)) {
    let data: PaymentWebhookDataEntity;

    try {
      switch (event.type) {
        case "PAYMENT_SUCCESS_WEBHOOK":
          data = event.object.data as PaymentWebhookDataEntity;

          if (!data.order?.order_id) {
            throw new Error("Order doesn't exist");
          }

          if (!data.customer_details?.customer_id) {
            throw new Error("User ID is required");
          }

          const user = await payload.findByID({
            collection: "users",
            id: data.customer_details.customer_id,
          });

          if (!user) {
            throw new Error("User not found");
          }

          const extendedOrder = await cashfree.PGFetchOrderExtendedData(
            data.order.order_id,
          );

          if (
            !extendedOrder.data.cart?.items ||
            !extendedOrder.data.cart.items.length ||
            extendedOrder.status !== 200
          ) {
            throw new Error("No cart items found");
          }

          const cartItems = extendedOrder.data.cart.items;

          for (const item of cartItems) {
            await payload.create({
              collection: "orders",
              data: {
                cashfreeOrderId: data.order.order_id,
                user: user.id,
                product: Number(item.item_id),
                title: item.item_name || "",
                price: Number(item.item_original_unit_price),
                discountedPrice: Number(item.item_discounted_unit_price),
              },
            });
          }
          break;
        default:
          throw new Error(`Unhandled event: ${event.type}`);
      }
    } catch {
      return NextResponse.json(
        { message: "Webhook handler failed" },
        { status: 500 },
      );
    }
  }

  return new NextResponse("ok");
}
