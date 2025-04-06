"use server";

import { db } from "@/db";
import { tryCatch } from "@/lib/try-catch";

export async function getStore(userId: string) {
  const { data: store, error } = await tryCatch(
    db.query.stores.findFirst({
      where: (f, o) => o.and(o.eq(f.userId, userId), o.ne(f.status, "pending")),
      columns: { id: true },
    })
  );

  if (error || !store) {
    return {
      data: null,
      error: "Unable to find store",
    };
  }

  return {
    data: store.id,
    error: null,
  };
}
