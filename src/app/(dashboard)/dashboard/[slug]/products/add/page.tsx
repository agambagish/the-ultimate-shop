import { Card, CardContent } from "@/components/ui/card";
import { CreateProductForm } from "@/modules/dashboard/components/create-product-form";
import { Heading } from "@/modules/dashboard/components/heading";

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-8">
      <Heading
        title="Add new product"
        description="Create a new product in your store"
      />
      <Card>
        <CardContent>
          <CreateProductForm />
        </CardContent>
      </Card>
    </div>
  );
}
