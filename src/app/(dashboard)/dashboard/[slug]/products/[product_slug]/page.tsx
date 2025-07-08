import { notFound } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/modules/dashboard/components/heading";
import { UpdateProductForm } from "@/modules/dashboard/components/update-product-form";
import { getProductData } from "@/modules/dashboard/server/get-product-data";

interface Props {
  params: Promise<{ product_slug: string }>;
}

export default async function Page({ params }: Props) {
  const _params = await params;

  const product = await getProductData(_params.product_slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-8">
      <Heading
        title="Update product"
        description="Update a existing product of your store"
      />
      <Card>
        <CardContent>
          <UpdateProductForm initialValues={product} />
        </CardContent>
      </Card>
    </div>
  );
}
