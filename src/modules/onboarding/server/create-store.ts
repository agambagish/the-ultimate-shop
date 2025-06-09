"use server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/db";
import { stores } from "@/db/schema";
import { tryCatch } from "@/lib/try-catch";

import type { OnboardingSchema } from "../schemas/onboarding-schema";

export async function createStore(values: OnboardingSchema) {
  const { userId } = await auth();

  if (!userId) {
    return {
      data: null,
      error: "You're not logged in",
    };
  }

  const { data: newStore, error } = await tryCatch(
    db
      .insert(stores)
      .values({
        ...values,
        avatarUrl: "",
        userId,
      })
      .returning({
        slug: stores.slug,
      })
  );

  if (error) {
    return {
      data: null,
      error: "Something went wrong! Please try again.",
    };
  }

  return {
    data: newStore[0].slug,
    error: null,
  };
}
