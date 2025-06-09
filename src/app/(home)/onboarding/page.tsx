import { notFound, redirect } from "next/navigation";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/db";
import { tryCatch } from "@/lib/try-catch";
import { OnboardingForm } from "@/modules/onboarding/components/onboarding-form";

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { data: store, error } = await tryCatch(
    db.query.stores.findFirst({
      where: (f, o) => o.eq(f.userId, userId),
      columns: { id: true },
    })
  );

  if (error || !!store?.id) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-32">
      <OnboardingForm />
    </div>
  );
}
