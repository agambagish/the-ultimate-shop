"use client";

import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, PencilLineIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { products } from "@/db/schema";
import { updateProduct } from "@/features/product/actions";
import { ProductForm } from "@/features/product/components/product-form";
import type { UpdateProductSchema } from "@/features/product/lib/update-product-schema";
import { updateProductSchema } from "@/features/product/lib/update-product-schema";
import type { getCategories } from "@/features/product/queries";

interface Props extends React.ComponentPropsWithRef<typeof Sheet> {
  product: typeof products.$inferSelect | null;
  categoriesPromise: Promise<Awaited<ReturnType<typeof getCategories>>>;
}

export function UpdateProductSheet({
  product,
  categoriesPromise,
  ...props
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<UpdateProductSchema>({
    mode: "onChange",
    resolver: zodResolver(updateProductSchema),
  });

  useEffect(() => {
    if (props.open) {
      if (!product) return;
      const imageFiles = product.images.map((image, i) => {
        const file = new File([], `Product Image ${i + 1}`, {
          type: "image",
        });

        const fileWithPreview = Object.assign(file, {
          preview: image,
        });

        return fileWithPreview;
      });

      form.setValue("title", product.title);
      form.setValue("description", product.description);
      form.setValue("price", product.price);
      form.setValue("discountedPrice", product.discountedPrice);
      form.setValue("inventory", product.inventory);
      form.setValue("categorySlug", product.categorySlug);
      form.setValue("status", product.status);
      form.setValue("images", imageFiles);
    }
  }, [form, product, props.open]);

  const { dirtyFields } = form.formState;

  async function onSubmit(payload: UpdateProductSchema) {
    setIsLoading(true);

    const { data, error } = await updateProduct({
      productId: product?.id ?? NaN,
      payload,
      dirtyFields: {
        ...dirtyFields,
        images: dirtyFields.images as boolean | undefined,
      },
    });

    if (error) {
      toast.error(error);
      setIsLoading(false);
      return;
    }

    if (data) {
      toast.success("Product updated successfully");
    }

    setIsLoading(false);
  }

  return (
    <Sheet {...props}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader className="text-left">
          <SheetTitle>Update product</SheetTitle>
          <SheetDescription>
            Update the product details and save the changes
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <ProductForm<UpdateProductSchema>
            form={form}
            onSubmit={onSubmit}
            isLoading={isLoading}
            progresses={{}}
            categoriesPromise={categoriesPromise}
          >
            <SheetFooter className="flex flex-row justify-end pt-2">
              <SheetClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  size="sm"
                >
                  Cancel
                </Button>
              </SheetClose>
              <Button
                type="submit"
                disabled={isLoading}
                size="sm"
                variant="outline"
              >
                {isLoading ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <PencilLineIcon />
                )}
                Update
              </Button>
            </SheetFooter>
          </ProductForm>
        </div>
      </SheetContent>
    </Sheet>
  );
}
