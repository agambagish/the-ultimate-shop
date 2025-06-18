import Link from "next/link";

import { PlusCircleIcon } from "lucide-react";

import { DataTable } from "@/components/data-table";
import { buttonVariants } from "@/components/ui/button";
import { productsDataColumns } from "@/modules/dashboard/columns/products-data-columns";
import { Heading } from "@/modules/dashboard/components/heading";
import { getProductsData } from "@/modules/dashboard/server/get-products-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: Props) {
  const productsData = await getProductsData((await params).slug);

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-8">
      <div className="flex items-center justify-between">
        <Heading title="Products" description="Check your products" />
        <Link
          href={`/dashboard/${(await params).slug}/products/add`}
          className={buttonVariants()}
        >
          <PlusCircleIcon />
          Add new
        </Link>
      </div>
      <DataTable columns={productsDataColumns} data={productsData} />
    </div>
  );
}
