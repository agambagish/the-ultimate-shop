import { CreditCardIcon, IndianRupeeIcon, PackageIcon } from "lucide-react";

import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { RevenueByMonthChart } from "@/modules/dashboard/charts/revenue-by-month-chart";
import { TopSellingProductsChart } from "@/modules/dashboard/charts/top-selling-products-chart";
import { recentOrdersDataColumns } from "@/modules/dashboard/columns/recent-orders-data-columns";
import { Heading } from "@/modules/dashboard/components/heading";
import { getOverviewData } from "@/modules/dashboard/server/get-overview-data";
import { getRecentOrders } from "@/modules/dashboard/server/get-recent-orders";
import { getRevenueByMonth } from "@/modules/dashboard/server/get-revenue-by-month";
import { getTopSellingProducts } from "@/modules/dashboard/server/get-top-selling-products";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: Props) {
  const _params = await params;

  const [
    { revenue, unitsSold, productCount },
    topSellingProducts,
    revenueByMonth,
    recentOrders,
  ] = await Promise.all([
    getOverviewData(_params.slug),
    getTopSellingProducts(_params.slug),
    getRevenueByMonth(_params.slug),
    getRecentOrders(_params.slug),
  ]);

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
              {formatPrice(revenue, { notation: "compact" })}
            </div>
          </CardContent>
        </Card>
        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">
              Unit(s) Sold
            </CardTitle>
            <CreditCardIcon className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unitsSold}</div>
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
            <div className="text-2xl font-bold">{productCount}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <RevenueByMonthChart data={revenueByMonth} />
        <TopSellingProductsChart data={topSellingProducts} />
      </div>
      <div>
        <h3 className="text-2xl font-bold tracking-tight">Recent Orders</h3>
        <p className="text-muted-foreground text-xs">
          Overview of your recent orders
        </p>
      </div>
      <DataTable columns={recentOrdersDataColumns} data={recentOrders} />
    </div>
  );
}
