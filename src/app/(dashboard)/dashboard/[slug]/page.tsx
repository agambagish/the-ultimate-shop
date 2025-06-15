import { CreditCardIcon, IndianRupeeIcon, PackageIcon } from "lucide-react";

import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { SalesByMonthChart } from "@/modules/dashboard/charts/sales-by-month-chart";
import { TopSellingProductsChart } from "@/modules/dashboard/charts/top-selling-products-chart";
import { recentOrdersDataColumns } from "@/modules/dashboard/columns/recent-orders-data-columns";
import { Heading } from "@/modules/dashboard/components/heading";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: Props) {
  const _params = await params;

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-8">
      <Heading title="Dashboard" description="Overview of your store" />
      <Separator />
      <div className="grid grid-cols-3 gap-4">
        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">
              Total Revenue
            </CardTitle>
            <IndianRupeeIcon className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(100000, { notation: "compact" })}
            </div>
          </CardContent>
        </Card>
        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Sales</CardTitle>
            <CreditCardIcon className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+27</div>
          </CardContent>
        </Card>
        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">
              Product in Stock
            </CardTitle>
            <PackageIcon className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SalesByMonthChart />
        <TopSellingProductsChart />
      </div>
      <div>
        <h3 className="text-2xl font-bold tracking-tight">Recent Sales</h3>
        <p className="text-muted-foreground text-xs">
          Overview of your recent sales
        </p>
      </div>
      <DataTable
        // @ts-expect-error IDK
        columns={recentOrdersDataColumns}
        data={[
          {
            id: "1",
            amount: "99.00",
            customer: "John Doe",
            email: "johndoe@gmail.com",
            status: "Yet to deliver",
          },
          {
            id: "2",
            amount: "77.63",
            customer: "Tracy R",
            email: "rtracy@gmail.com",
            status: "Cancelled",
          },
        ]}
      />
    </div>
  );
}
