import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { currentUser } from "@clerk/nextjs/server";

import { db } from "@/db";
import { OnboardingForm } from "@/features/onboarding/components/onboarding-form";
import { tryCatch } from "@/lib/try-catch";
import { getEmail } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Onboarding",
};

export default async function Page() {
  const user = await currentUser();

  if (!user?.id) {
    redirect("/sign-in");
  }

  const { data: store, error } = await tryCatch(
    db.query.stores.findFirst({
      where: (f, o) => o.eq(f.email, getEmail(user)),
      columns: { id: true },
    })
  );

  if (!!error || !!store?.id) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-4xl bg-white px-4 py-12">
      <div className="mb-10">
        <h1 className="mb-2 text-center text-3xl font-bold">
          Seller Onboarding
        </h1>
        <p className="text-muted-foreground text-center">
          Complete the following steps to start selling on our platform
        </p>
      </div>
      <OnboardingForm />
    </div>
  );
}
