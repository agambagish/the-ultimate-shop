"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CircleSmallIcon,
  Loader2Icon,
  PackageIcon,
  PlusCircleIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FileUploader } from "@/components/global/file-uploader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { productStatusEnum } from "@/db/schema";
import type { CreateProductSchema } from "@/features/dashboard/lib/create-product-schema";
import { createProductSchema } from "@/features/dashboard/lib/create-product-schema";
import { useUploadFile } from "@/hooks/use-upload-file";
import { tryCatch } from "@/lib/try-catch";
import { cn } from "@/lib/utils";

import { createProduct } from "../actions/create-product";

export function CreateProductForm() {
  const { progresses, isUploading, uploadFiles } = useUploadFile({
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Red T-shirt"
                  {...field}
                  disabled={isDisabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus incidunt repellendus nisi."
                  className="min-h-[100px] resize-none"
                  disabled={isDisabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    className="peer ps-6 pe-12 tabular-nums"
                    placeholder="69.00"
                    type="number"
                    disabled={isDisabled}
                    {...field}
                  />
                  <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
                    ₹
                  </span>
                  <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
                    INR
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="inventory"
          render={() => (
            <FormItem>
              <FormLabel>Inventory</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    className="peer pe-9 tabular-nums"
                    placeholder="e.g. 18"
                    type="number"
                    disabled={isDisabled}
                    {...form.register("inventory", {
                      valueAsNumber: true,
                    })}
                  />
                  <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                    <PackageIcon className="size-4" />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isDisabled}
              >
                <FormControl>
                  <SelectTrigger className="w-full capitalize">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {productStatusEnum.enumValues.map((e) => (
                    <SelectItem key={e} value={e}>
                      <span className="flex items-center gap-2 capitalize">
                        <StatusDot status={e} />
                        {e.replaceAll("_", " ")}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Images</FormLabel>
              <FormControl>
                <FileUploader
                  value={field.value}
                  onValueChange={field.onChange}
                  maxFileCount={4}
                  maxSize={4 * 1024 * 1024}
                  progresses={progresses}
                  // pass the onUpload function here for direct upload
                  // onUpload={uploadFiles}
                  disabled={isDisabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isDisabled}
          className="w-full"
          size="lg"
        >
          {isDisabled ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <PlusCircleIcon />
          )}
          Create
        </Button>
      </form>
    </Form>
  );
}

interface Props {
  status: (typeof productStatusEnum.enumValues)[number];
}

function StatusDot({ status }: Props) {
  const statusColorMap: Record<
    (typeof productStatusEnum.enumValues)[number],
    string
  > = {
    active: "text-emerald-600 fill-emerald-600",
    draft: "text-blue-500 fill-blue-500",
    archived: "text-red-500 fill-red-500",
  };

  return <CircleSmallIcon className={cn(statusColorMap[status], "size-4")} />;
}
