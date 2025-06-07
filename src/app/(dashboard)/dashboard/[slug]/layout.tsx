import { notFound } from "next/navigation";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/db";
import { tryCatch } from "@/lib/try-catch";
import { DashboardLayout } from "@/modules/dashboard/ui/layouts/dashboard-layout";

export default async function Layout({ children }: React.PropsWithChildren) {
  const { userId } = await auth();

  const { data: store, error } = await tryCatch(
    db.query.stores.findFirst({
      where: (f, o) =>
        o.and(o.eq(f.userId, userId ?? ""), o.ne(f.status, "pending")),
      columns: { id: true },
    })
  );

  if (error || !store) {
    notFound();
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
