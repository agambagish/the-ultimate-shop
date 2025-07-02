"use client";

import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEdgestore } from "@/hooks/use-edgestore";
import { Heading } from "@/modules/dashboard/components/heading";
import { ProductForm } from "@/modules/dashboard/components/product-form";
import type { CreateProductSchema } from "@/modules/dashboard/schemas/create-product-schema";
import { createProductSchema } from "@/modules/dashboard/schemas/create-product-schema";
import { createProduct } from "@/modules/dashboard/server/create-product";
import { getCategories } from "@/modules/home/server/get-categories";

export default function Page() {
  const [isCategoriesLoading, setIsCategoriesLoading] =
    useState<boolean>(false);
  const [categories, setCategories] = useState<
    Awaited<ReturnType<typeof getCategories>>
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { isUploading, uploadFiles } = useEdgestore();

  useEffect(() => {
    (async () => {
      setIsCategoriesLoading(true);
      try {
        const result = await getCategories();
        setCategories(result);
      } finally {
        setIsCategoriesLoading(false);
      }
    })();
  }, []);

  const disabled = isLoading || isUploading;

  const form = useForm<CreateProductSchema>({
    resolver: zodResolver(createProductSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      longDescription: "",
      price: "",
      discountPercentage: NaN,
      thumbnailImage: [],
      image1: [],
      image2: [],
      image3: [],
      image4: [],
      image5: [],
      productAsset: [],
      productCategoryId: "",
    },
  });

  function onSubmit(values: CreateProductSchema) {
    setIsLoading(true);

    const allImages = [
      ...values.image1,
      ...values.image2,
      ...values.image3,
      ...values.image4,
      ...values.image5,
    ];

    toast.promise(
      uploadFiles({
        endpoint: "thumbnailImages",
        files: values.thumbnailImage,
      }).then((thumbnailImageURLs) =>
        uploadFiles({
          endpoint: "productImages",
          files: allImages,
        }).then((imageURLs) => {
          const [productAsset] = values.productAsset;
          const [thumbnailImageURL] = thumbnailImageURLs;
          const [imageURL1, imageURL2, imageURL3, imageURL4, imageURL5] =
            imageURLs;

          createProduct({
            ...values,
            productAsset,
            thumbnailImageURL,
            imageURL1,
            imageURL2,
            imageURL3,
            imageURL4,
            imageURL5,
          });
        })
      ),
      {
        loading: "Creating product...",
        success: () => {
          form.reset();
          setIsLoading(false);
          return "Product created";
        },
        error: ({ message }: { message: string }) => {
          setIsLoading(false);
          return message;
        },
      }
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-8">
      <Heading
        title="Add new product"
        description="Create a new product in your store"
      />
      <Card>
        <CardContent>
          <ProductForm
            form={form}
            onSubmit={onSubmit}
            categories={categories}
            isCategoriesLoading={isCategoriesLoading}
            disabled={disabled}
          >
            <div className="flex justify-end">
              <Button disabled={disabled}>
                {disabled && <Loader2Icon className="animate-spin" />}
                Create
              </Button>
            </div>
          </ProductForm>
        </CardContent>
      </Card>
    </div>
  );
}
