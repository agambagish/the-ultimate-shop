"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, PlusCircleIcon } from "lucide-react";
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
  SheetTrigger,
} from "@/components/ui/sheet";
import { createProduct } from "@/features/product/actions";
import { ProductForm } from "@/features/product/components/product-form";
import type { CreateProductSchema } from "@/features/product/lib/create-product-schema";
import { createProductSchema } from "@/features/product/lib/create-product-schema";
import { useUploadFile } from "@/hooks/use-upload-file";
import { tryCatch } from "@/lib/try-catch";

export function CreateProductSheet() {
  const { uploadFiles, isUploading, progresses } = useUploadFile({
    route: "productImages",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isDisabled = isLoading || isUploading;

  const form = useForm<CreateProductSchema>({
    resolver: zodResolver(createProductSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      price: "",
      inventory: 0,
      images: [],
      status: "draft",
    },
  });

  async function onSubmit(payload: CreateProductSchema) {
    setIsLoading(true);

    const { data: images, error: uploadError } = await tryCatch(
      uploadFiles(payload.images)
    );

    if (uploadError) {
      toast.error("Unable to upload images");
      return;
    }

    const { data, error } = await createProduct({ ...payload, images });

    if (error) {
      toast.error(error);
    }

    if (data) {
      toast.success("New product created successfully");
    }

    setIsLoading(false);
    form.reset();
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline">
          <PlusCircleIcon />
          Add
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader className="text-left">
          <SheetTitle>Create product</SheetTitle>
          <SheetDescription>
            Fill the product details and save the changes
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <ProductForm<CreateProductSchema>
            form={form}
            onSubmit={onSubmit}
            isLoading={isDisabled}
            progresses={progresses}
          >
            <SheetFooter className="flex flex-row justify-end pt-2">
              <SheetClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isDisabled}
                  size="sm"
                >
                  Cancel
                </Button>
              </SheetClose>
              <Button
                type="submit"
                disabled={isDisabled}
                size="sm"
                variant="outline"
              >
                {isDisabled ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <PlusCircleIcon />
                )}
                Create
              </Button>
            </SheetFooter>
          </ProductForm>
        </div>
      </SheetContent>
    </Sheet>
  );
}
