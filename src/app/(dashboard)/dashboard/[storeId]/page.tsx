import { notFound, redirect } from "next/navigation";

import { currentUser } from "@clerk/nextjs/server";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { db } from "@/db";
import { ChartAreaInteractive } from "@/features/dashboard/components/chart-area-interactive";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { SectionCards } from "@/features/dashboard/components/section-cards";
import { tryCatch } from "@/lib/try-catch";
import { getEmail } from "@/lib/utils";

interface Props {
  params: Promise<{ storeId: string }>;
}

export default async function Page({ params }: Props) {
  const { storeId } = await params;
  const user = await currentUser();

  if (!user?.id) {
    redirect("/sign-in");
  }

  const { data: store, error } = await tryCatch(
    db.query.stores.findFirst({
      where: (f, o) =>
        o.and(o.eq(f.id, Number(storeId)), o.eq(f.email, getEmail(user))),
      columns: { storeName: true },
    })
  );

  if (!!error || !store) {
    notFound();
  }

  return (
    <SidebarProvider>
      <DashboardSidebar variant="inset" storeName={store.storeName} />
      <SidebarInset>
        <DashboardHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              {/* <DataTable data={data} /> */}
              DataTable goes here
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
