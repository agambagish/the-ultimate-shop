"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/modules/dashboard/components/heading";
import { ProductForm } from "@/modules/dashboard/components/product-form";
import type { CreateProductSchema } from "@/modules/dashboard/schemas/product-schema";
import { createProductSchema } from "@/modules/dashboard/schemas/product-schema";
import { createProduct } from "@/modules/dashboard/server/create-product";

export default function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<CreateProductSchema>({
    resolver: zodResolver(createProductSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      longDescription: "",
      price: "",
      discountPercentage: NaN,
    },
  });

  async function onSubmit(values: CreateProductSchema) {
    setIsLoading(true);

    const { data, error } = await createProduct(values);

    if (error) {
      toast.error(error);
      return;
    }

    if (data) {
      toast.success("Product created");
      form.reset();
    }

    setIsLoading(false);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-8">
      <Heading
        title="Add new product"
        description="Create a new product in your store"
      />
      <Card>
        <CardContent>
          <ProductForm form={form} onSubmit={onSubmit} disabled={isLoading}>
            <div className="flex justify-end">
              <Button disabled={isLoading}>Create</Button>
            </div>
          </ProductForm>
        </CardContent>
      </Card>
    </div>
  );
}
