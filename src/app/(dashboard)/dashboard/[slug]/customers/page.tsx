import { DataTable } from "@/components/data-table";
import { customersDataColumns } from "@/modules/dashboard/columns/customers-data-columns";
import { Heading } from "@/modules/dashboard/components/heading";
import { getCustomersData } from "@/modules/dashboard/server/get-customers-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: Props) {
  const _params = await params;
  const customers = await getCustomersData(_params.slug);

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-8">
      <Heading title="Customers" description="Know your customer details" />
      <DataTable columns={customersDataColumns} data={customers} />
    </div>
  );
}
