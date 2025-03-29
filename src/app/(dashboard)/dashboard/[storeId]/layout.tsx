import { notFound, redirect } from "next/navigation";

import { currentUser } from "@clerk/nextjs/server";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { db } from "@/db";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { tryCatch } from "@/lib/try-catch";
import { getEmail } from "@/lib/utils";

interface Props extends React.PropsWithChildren {
  params: Promise<{ storeId: string }>;
}

export default async function Layout({ children, params }: Props) {
  const { storeId } = await params;
  const user = await currentUser();

  if (!user?.id) {
    redirect("/sign-in");
  }

  const { data: store, error } = await tryCatch(
    db.query.stores.findFirst({
      where: (f, o) =>
        o.and(
          o.eq(f.id, Number(storeId)),
          o.eq(f.email, getEmail(user)),
          o.ne(f.status, "pending")
        ),
      columns: { storeName: true },
    })
  );

  if (!!error || !store) {
    notFound();
  }

  return (
    <SidebarProvider>
      <DashboardSidebar
        variant="inset"
        storeName={store.storeName}
        storeId={storeId}
      />
      <SidebarInset>
        <DashboardHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
