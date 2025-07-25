import { notFound } from "next/navigation";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/db";
import { tryCatch } from "@/lib/try-catch";
import { DashboardNavbar } from "@/modules/dashboard/components/dashboard-navbar";
import { Footer } from "@/modules/layout/components/footer";

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

  return (
    <main className="flex min-h-screen flex-col">
      <DashboardNavbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </main>
  );
}
