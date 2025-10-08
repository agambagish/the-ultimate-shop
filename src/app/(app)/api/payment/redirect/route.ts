import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { env } from "@/env";
import { cashfree } from "@/lib/cashfree";
import { tryCatch } from "@/lib/try-catch";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const orderId = searchParams.get("orderId");
  const subdomain = searchParams.get("subdomain");

  if (!orderId || !subdomain) {
    return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}`);
  }

  const baseRedirectURL = `${env.NEXT_PUBLIC_APP_URL}/stores/${subdomain}/checkout`;

  const { data: orderDetails } = await tryCatch(cashfree.PGFetchOrder(orderId));

  if (
    orderDetails?.status !== 200 ||
    orderDetails.data.order_status !== "PAID"
  ) {
    return NextResponse.redirect(`${baseRedirectURL}?cancel=true`);
  }

  return NextResponse.redirect(`${baseRedirectURL}?success=true`);
}
