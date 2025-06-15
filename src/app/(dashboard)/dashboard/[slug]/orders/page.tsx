import { DataTable } from "@/components/data-table";
import { productsDataColumns } from "@/modules/dashboard/columns/products-data-columns";
import { Heading } from "@/modules/dashboard/components/heading";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function Page({}: Props) {
  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-8">
      <Heading title="Orders" description="Check status of orders" />
      <DataTable columns={productsDataColumns} data={[]} />
    </div>
  );
}
