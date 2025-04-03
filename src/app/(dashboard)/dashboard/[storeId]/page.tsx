import type { Metadata } from "next";

import { ChartAreaInteractive } from "@/features/dashboard/components/chart-area-interactive";
import { SectionCards } from "@/features/dashboard/components/section-cards";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function Page() {
  return (
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
  );
}
