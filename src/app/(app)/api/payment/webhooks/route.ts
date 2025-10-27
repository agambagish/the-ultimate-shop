import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import config from "@payload-config";
import type {
  OrderExtendedDataEntity,
  PaymentWebhookDataEntity,
  PGWebhookEvent,
} from "cashfree-pg";
import { getPayload } from "payload";

import { cashfree } from "@/lib/cashfree";
import { prisma } from "@/lib/prisma";
import type { StrictDefined } from "@/lib/types";
import type { Order } from "@/payload-types";

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
    let data: StrictDefined<PaymentWebhookDataEntity>;

    try {
      switch (event.type) {
        case "PAYMENT_SUCCESS_WEBHOOK":
          data = event.object.data as StrictDefined<PaymentWebhookDataEntity>;

          const user = await prisma.users.findUnique({
            where: {
              id: Number(data.customer_details.customer_id),
            },
            select: { id: true },
          });

          if (!user) {
            throw new Error("User not found");
          }

          const { data: extendedOrder } =
            (await cashfree.PGFetchOrderExtendedData(data.order.order_id)) as {
              data: StrictDefined<OrderExtendedDataEntity>;
            };

          if (extendedOrder.cart.items.length === 0) {
            throw new Error("No cart items found");
          }

          const cartItems = extendedOrder.cart.items;

          let paymentDetails: Order["paymentDetails"] = [];

          if ("upi" in data.payment.payment_method) {
            paymentDetails = [
              {
                blockType: "upi",
                vpa: data.payment.payment_method.upi.upi_id,
              },
            ];
          } else if ("card" in data.payment.payment_method) {
            paymentDetails = [
              {
                blockType: "card",
                cardNumber: data.payment.payment_method.card.card_number,
                cardNetwork: data.payment.payment_method.card.card_network,
                cardBankName: data.payment.payment_method.card.card_bank_name,
              },
            ];
          }

          for (const item of cartItems) {
            await payload.create({
              collection: "orders",
              data: {
                cashfreeOrderId: data.order.order_id,
                cashfreePaymentId: data.payment.cf_payment_id,
                user: user.id,
                product: Number(item.item_id),
                price: Number(item.item_original_unit_price),
                discountedPrice: Number(item.item_discounted_unit_price),
                paymentDetails,
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
