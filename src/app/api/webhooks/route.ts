import type { NextRequest } from "next/server";

import { verifyWebhook } from "@clerk/nextjs/webhooks";

import { db } from "@/db";
import { users } from "@/db/schema";
import { tryCatch } from "@/lib/try-catch";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    if (evt.type === "user.created") {
      await tryCatch(
        db.insert(users).values({
          clerkId: evt.data.id,
        })
      );
    }
    return new Response("Webhook received", { status: 200 });
  } catch {
    return new Response("Error verifying webhook", { status: 400 });
  }
}
