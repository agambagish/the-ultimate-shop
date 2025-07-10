"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ConstructionIcon,
  Loader2Icon,
  PercentIcon,
  SquareArrowOutUpRightIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ProductAssetInput } from "@/components/product-asset-input";
import { SingleImageInput } from "@/components/single-image-input";
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
import type { Product } from "@/db/schema";
import { useEdgestore } from "@/hooks/use-edgestore";

import { useUpdateProductStates } from "../hooks/use-update-product-states";
import type { UpdateProductSchema } from "../schemas/update-product-schema";
import { updateProductSchema } from "../schemas/update-product-schema";
import { getCategories } from "../server/get-categories";
import { updateProduct } from "../server/update-product";

interface Props {
  initialValues: Omit<
    Product,
    "id" | "rating" | "fileTypes" | "storeId" | "createdAt" | "updatedAt"
  >;
}

export function UpdateProductForm({ initialValues }: Props) {
  const router = useRouter();
  const { state, setState } = useUpdateProductStates();
  const { replaceFile, isUploading } = useEdgestore();

  const isDisabled = state.isLoading || isUploading;

  const form = useForm<UpdateProductSchema>({
    resolver: zodResolver(updateProductSchema),
    mode: "onChange",
    defaultValues: {
      ...initialValues,
      productCategoryId: initialValues.productCategoryId.toString(),
      thumbnailImage: [],
      image1: [],
      image2: [],
      image3: [],
      image4: [],
      image5: [],
      productAsset: [],
    },
  });

  useEffect(() => {
    (async () => {
      setState({ type: "SET_CATEGORIES_LOADING", payload: true });

      try {
        const categories = await getCategories();
        setState({ type: "SET_CATEGORIES", payload: categories });
      } finally {
        setState({ type: "SET_CATEGORIES_LOADING", payload: false });
      }
    })();
  }, [setState]);

  const imageFields = [
    {
      field: "thumbnailImage",
      endpoint: "thumbnailImages",
      oldFileURL: initialValues.thumbnailImageURL,
    },
    {
      field: "image1",
      endpoint: "productImages",
      oldFileURL: initialValues.imageURL1,
    },
    {
      field: "image2",
      endpoint: "productImages",
      oldFileURL: initialValues.imageURL2,
    },
    {
      field: "image3",
      endpoint: "productImages",
      oldFileURL: initialValues.imageURL3,
    },
    {
      field: "image4",
      endpoint: "productImages",
      oldFileURL: initialValues.imageURL4,
    },
    {
      field: "image5",
      endpoint: "productImages",
      oldFileURL: initialValues.imageURL5,
    },
  ] as const;

  type ImageField = (typeof imageFields)[number]["field"];
  const updatedURLs: Partial<Record<ImageField, string>> = {};
  const dirtyFields = form.formState.dirtyFields;

  async function handleSubmit(values: UpdateProductSchema) {
    setState({ type: "SET_LOADING", payload: true });

    try {
      for (const { field, endpoint, oldFileURL } of imageFields) {
        if (dirtyFields[field]) {
          const url = await replaceFile({
            endpoint,
            file: values[field] ?? [],
            oldFileURL: oldFileURL ?? "",
          });

          updatedURLs[field] = url[0];
        }
      }

      const filteredValues = Object.fromEntries(
        (Object.keys(values) as (keyof typeof values)[])
          .filter((key) => dirtyFields[key])
          .map((key) => [key, values[key]])
      );

      await updateProduct({
        slug: initialValues.slug,
        values: {
          ...filteredValues,
          thumbnailImageURL: updatedURLs.thumbnailImage,
          imageURL1: updatedURLs.image1,
          imageURL2: updatedURLs.image2,
          imageURL3: updatedURLs.image3,
          imageURL4: updatedURLs.image4,
          imageURL5: updatedURLs.image5,
        },
      });

      toast.success("Product updated");
      router.refresh();
    } catch (err) {
      // @ts-expect-error error message type error
      toast.error(err?.message || "Failed to create product");
    } finally {
      setState({ type: "SET_LOADING", payload: false });
    }
  }

  function renderImageField(
    name: keyof UpdateProductSchema,
    label: string,
    initialURL: string | null,
    required?: boolean
  ) {
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {label} {required && <span className="text-destructive">*</span>}
              {initialURL && (
                <Link href={initialURL} target="_blank">
                  <SquareArrowOutUpRightIcon className="text-muted-foreground ml-2 size-4" />
                </Link>
              )}
            </FormLabel>
            <FormControl>
              <SingleImageInput
                field={field}
                form={form}
                disabled={isDisabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
        {[
          { name: "title", label: "Title", placeholder: "Star Icon Pack" },
          { name: "slug", label: "Slug", placeholder: "star-icon-pack" },
          {
            name: "description",
            label: "Description",
            placeholder: "A customizable icon pack",
          },
        ].map(({ name, label, placeholder }, i) => (
          <FormField
            key={i}
            control={form.control}
            name={
              name as keyof Pick<
                UpdateProductSchema,
                "title" | "slug" | "description"
              >
            }
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={placeholder}
                    disabled={isDisabled}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <FormField
          control={form.control}
          name="productCategoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                {state.isCategoriesLoading ? (
                  <Skeleton className="h-9 w-full" />
                ) : (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isDisabled}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {state.categories.map((c, i) => (
                        <SelectItem key={i} value={String(c.id)}>
                          {c.label}
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
          name="longDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Long Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Full product description..."
                  disabled={isDisabled}
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
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      className="peer ps-6 pe-12"
                      type="number"
                      placeholder="963.00"
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
            name="discountPercentage"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Discount %</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="12"
                      disabled={isDisabled}
                      {...field}
                      value={field.value || ""}
                      {...form.register("discountPercentage", {
                        valueAsNumber: true,
                      })}
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
        <div className="rounded-md border px-4 py-3">
          <p className="text-sm">
            <ConstructionIcon
              className="me-3 -mt-0.5 inline-flex text-amber-500"
              size={16}
            />
            This is a work in progress; currently, existing images are rendered
            as shown. To replace an image, simply select a new one in any field
            below.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {renderImageField(
            "thumbnailImage",
            "Thumbnail Image",
            initialValues.thumbnailImageURL,
            true
          )}
          {renderImageField("image1", "Image 1", initialValues.imageURL1, true)}
          {renderImageField("image2", "Image 2", initialValues.imageURL2, true)}
          {renderImageField("image3", "Image 3", initialValues.imageURL3)}
          {renderImageField("image4", "Image 4", initialValues.imageURL4)}
          {renderImageField("image5", "Image 5", initialValues.imageURL5)}
        </div>
        <FormField
          control={form.control}
          name="productAsset"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Asset</FormLabel>
              <FormControl>
                <ProductAssetInput
                  form={form}
                  field={field}
                  disabled={isDisabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isDisabled || !form.formState.isDirty}
          className="w-full"
        >
          {isDisabled && <Loader2Icon className="animate-spin" />}
          Update Product
        </Button>
      </form>
    </Form>
  );
}
