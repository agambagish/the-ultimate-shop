"use client";

import { use } from "react";

import { CircleSmallIcon, PackageIcon } from "lucide-react";
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

import { FileUploader } from "@/components/global/file-uploader";
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
import type { getCategories } from "@/features/product/queries";
import { cn } from "@/lib/utils";

interface Props<T extends FieldValues>
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<T>;
  onSubmit: (payload: T) => void;
  isLoading: boolean;
  progresses: Record<string, number>;
  categoriesPromise: Promise<Awaited<ReturnType<typeof getCategories>>>;
}

export function ProductForm<T extends FieldValues>({
  form,
  onSubmit,
  children,
  isLoading,
  progresses,
  categoriesPromise,
}: Props<T>) {
  const { categories } = use(categoriesPromise);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name={"title" as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Red T-shirt"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"description" as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus incidunt repellendus nisi."
                  className="min-h-[100px] resize-none"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"price" as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    className="peer ps-6 pe-12 tabular-nums"
                    placeholder="69.00"
                    type="number"
                    disabled={isLoading}
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
          name={"inventory" as FieldPath<T>}
          render={() => (
            <FormItem>
              <FormLabel>Inventory</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    className="peer pe-9 tabular-nums"
                    placeholder="e.g. 18"
                    type="number"
                    disabled={isLoading}
                    {...form.register("inventory" as FieldPath<T>, {
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
          name={"categoryId" as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem
                      key={c.id}
                      value={String(c.id)}
                      {...form.register("categoryId" as FieldPath<T>, {
                        valueAsNumber: true,
                      })}
                    >
                      {c.label}
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
          name={"status" as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
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
          name={"images" as FieldPath<T>}
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
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {children}
      </form>
    </Form>
  );
}

function StatusDot({
  status,
}: {
  status: (typeof productStatusEnum.enumValues)[number];
}) {
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
