import { DataTable } from "@/components/data-table";
import { ordersDataColumns } from "@/modules/dashboard/columns/orders-data-columns";
import { Heading } from "@/modules/dashboard/components/heading";
import { getOrdersData } from "@/modules/dashboard/server/get-orders-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: Props) {
  const _params = await params;
  const orders = await getOrdersData(_params.slug);

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-8">
      <Heading title="Orders" description="Check status of orders" />
      <DataTable columns={ordersDataColumns} data={orders} />
    </div>
  );
}
