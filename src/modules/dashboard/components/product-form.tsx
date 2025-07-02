"use client";

import { CloudUploadIcon, PercentIcon, XIcon } from "lucide-react";
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/file-upload";
import { SingleImageField } from "@/components/single-image-field";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import type { ProductCategory } from "@/db/schema";

type CategoryType = Pick<
  ProductCategory,
  "id" | "label" | "slug" | "description" | "icon"
>;

interface Props<T extends FieldValues>
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<T>;
  disabled: boolean;
  onSubmit: (values: T) => void;
  categories: CategoryType[];
  isCategoriesLoading: boolean;
  purpose?: "create" | "update";
}

export function ProductForm<T extends FieldValues>({
  form,
  onSubmit,
  children,
  categories,
  isCategoriesLoading,
  disabled,
}: Props<T>) {
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name={"title" as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Star Icon Pack"
                  disabled={disabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"slug" as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input
                  placeholder="star-icon-pack"
                  disabled={disabled}
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
                <Input
                  placeholder="A highly customizable icon pack available in psd & figma format"
                  disabled={disabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"productCategoryId" as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                {isCategoriesLoading ? (
                  <Skeleton className="h-9 w-full" />
                ) : (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="UI Kits" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category, i) => (
                        <SelectItem key={i} value={String(category.id)}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"longDescription" as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Long Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={
                    "# Designed with love & care\n\n- PSD format available\n- Figma file available"
                  }
                  disabled={disabled}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex space-x-6">
          <FormField
            control={form.control}
            name={"price" as FieldPath<T>}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      className="peer ps-6 pe-12"
                      type="number"
                      placeholder="963.00"
                      disabled={disabled}
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
            name={"discountPercentage" as FieldPath<T>}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Discount Percentage</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      className="peer pe-9"
                      type="number"
                      placeholder="12"
                      disabled={disabled}
                      {...field}
                      {...form.register("discountPercentage" as FieldPath<T>, {
                        valueAsNumber: true,
                      })}
                      value={field.value || ""}
                    />
                    <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                      <PercentIcon size={16} />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FormField
            control={form.control}
            name={"thumbnailImage" as FieldPath<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thumbnail Image</FormLabel>
                <FormControl>
                  <SingleImageField
                    field={field}
                    form={form}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"image1" as FieldPath<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Image 1 <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <SingleImageField
                    field={field}
                    form={form}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"image2" as FieldPath<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Image 2 <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <SingleImageField
                    field={field}
                    form={form}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"image3" as FieldPath<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image 3</FormLabel>
                <FormControl>
                  <SingleImageField
                    field={field}
                    form={form}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"image4" as FieldPath<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image 4</FormLabel>
                <FormControl>
                  <SingleImageField
                    field={field}
                    form={form}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"image5" as FieldPath<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image 5</FormLabel>
                <FormControl>
                  <SingleImageField
                    field={field}
                    form={form}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name={"productAsset" as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product File</FormLabel>
              <FormControl>
                <FileUpload
                  value={field.value}
                  onValueChange={field.onChange}
                  accept="image/svg+xml, image/png, application/pdf, application/postscript, image/vnd.adobe.photoshop, application/zip, application/x-zip-compressed"
                  maxFiles={1}
                  maxSize={30 * 1024 * 1024}
                  onFileReject={(_, message) => {
                    form.setError("productAsset" as FieldPath<T>, {
                      message,
                    });
                  }}
                  multiple={false}
                  disabled={disabled}
                >
                  <FileUploadDropzone className="flex-row flex-wrap border-dotted text-center">
                    <CloudUploadIcon className="size-4" />
                    Drag and drop or
                    <FileUploadTrigger asChild>
                      <Button variant="link" size="sm" className="p-0">
                        Choose File
                      </Button>
                    </FileUploadTrigger>
                    to upload
                  </FileUploadDropzone>
                  <FileUploadList>
                    {field.value.map((file: File, i: number) => (
                      <FileUploadItem key={i} value={file}>
                        <FileUploadItemPreview />
                        <FileUploadItemMetadata />
                        <FileUploadItemDelete asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                          >
                            <XIcon />
                          </Button>
                        </FileUploadItemDelete>
                      </FileUploadItem>
                    ))}
                  </FileUploadList>
                </FileUpload>
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
