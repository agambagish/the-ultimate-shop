"use server";

import { currentUser } from "@clerk/nextjs/server";

import { db } from "@/db";
import { stores } from "@/db/schema";
import type { OnboardingSchema } from "@/features/onboarding/lib/onboarding-schema";
import { tryCatch } from "@/lib/try-catch";
import { getEmail } from "@/lib/utils";

export async function createStore(payload: OnboardingSchema) {
  const user = await currentUser();

  if (!user?.id) {
    return {
      data: null,
      error: "Unauthorized",
    };
  }

  const { data, error } = await tryCatch(
    db
      .insert(stores)
      .values({
        ...payload,
        email: getEmail(user),
      })
      .returning({ id: stores.id })
  );

  if (error) {
    return {
      data: null,
      error: "Something went wrong.",
    };
  }

  return {
    data: data[0].id,
    error: null,
  };
}
