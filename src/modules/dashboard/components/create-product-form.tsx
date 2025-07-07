"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUploadIcon, Loader2Icon, PercentIcon, XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { useEdgestore } from "@/hooks/use-edgestore";

import { useCreateProductStates } from "../hooks/use-create-product-states";
import type { CreateProductSchema } from "../schemas/create-product-schema";
import { createProductSchema } from "../schemas/create-product-schema";
import { createProduct } from "../server/create-product";
import { getCategories } from "../server/get-categories";

export function CreateProductForm() {
  const { state, setState } = useCreateProductStates();

  const { isUploading, uploadFiles } = useEdgestore();

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

  const isDisabled = state.isLoading || isUploading;

  async function handleSubmit(values: CreateProductSchema) {
    setState({ type: "SET_LOADING", payload: true });

    try {
      const [thumbnailImageURL] = await uploadFiles({
        endpoint: "thumbnailImages",
        files: values.thumbnailImage,
      });

      const imageURLs = await uploadFiles({
        endpoint: "productImages",
        files: [
          ...values.image1,
          ...values.image2,
          ...values.image3,
          ...values.image4,
          ...values.image5,
        ],
      });

      const [productAsset] = values.productAsset;

      await createProduct({
        ...values,
        productAsset,
        thumbnailImageURL,
        imageURL1: imageURLs[0],
        imageURL2: imageURLs[1],
        imageURL3: imageURLs[2],
        imageURL4: imageURLs[3],
        imageURL5: imageURLs[4],
      });

      form.reset();
      toast.success("Product created...");
    } catch (err) {
      // @ts-expect-error error message type error
      toast.error(err?.message || "Failed to create product");
    } finally {
      setState({ type: "SET_LOADING", payload: false });
    }
  }

  function renderImageField(
    name: keyof CreateProductSchema,
    label: string,
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
            </FormLabel>
            <FormControl>
              <SingleImageField
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
                CreateProductSchema,
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {renderImageField("thumbnailImage", "Thumbnail Image", true)}
          {renderImageField("image1", "Image 1", true)}
          {renderImageField("image2", "Image 2", true)}
          {renderImageField("image3", "Image 3")}
          {renderImageField("image4", "Image 4")}
          {renderImageField("image5", "Image 5")}
        </div>
        <FormField
          control={form.control}
          name="productAsset"
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
                  disabled={isDisabled}
                  onFileReject={(_, message) =>
                    form.setError("productAsset", { message })
                  }
                >
                  <FileUploadDropzone className="flex-row flex-wrap border-dotted text-center">
                    <CloudUploadIcon className="size-4" /> Drag & drop or{" "}
                    <FileUploadTrigger asChild>
                      <Button variant="link" size="sm" className="p-0">
                        Choose File
                      </Button>
                    </FileUploadTrigger>
                  </FileUploadDropzone>
                  <FileUploadList>
                    {field.value.map((file, i) => (
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
        <Button type="submit" disabled={isDisabled} className="w-full">
          {isDisabled && <Loader2Icon className="animate-spin" />}
          Create Product
        </Button>
      </form>
    </Form>
  );
}
