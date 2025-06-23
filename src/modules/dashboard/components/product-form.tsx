"use client";

import { PercentIcon } from "lucide-react";
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

import { ImageField } from "@/components/image-field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Props<T extends FieldValues>
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<T>;
  disabled: boolean;
  onSubmit: (values: T) => void;
  purpose?: "create" | "update";
}

export function ProductForm<T extends FieldValues>({
  form,
  onSubmit,
  children,
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
                  <ImageField field={field} form={form} disabled={disabled} />
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
                  <ImageField field={field} form={form} disabled={disabled} />
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
                  <ImageField field={field} form={form} disabled={disabled} />
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
                  <ImageField field={field} form={form} disabled={disabled} />
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
                  <ImageField field={field} form={form} disabled={disabled} />
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
                  <ImageField field={field} form={form} disabled={disabled} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {children}
      </form>
    </Form>
  );
}
