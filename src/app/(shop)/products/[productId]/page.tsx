import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { AddToCartButton } from "@/features/cart/add-to-cart-button";
import { CartCounter } from "@/features/cart/cart-counter";
import { getNewArrivals } from "@/features/home/queries";
import { ProductDetailsTabs } from "@/features/product/components/product-details-tabs";
import { ProductImageGallery } from "@/features/product/components/product-image-gallery";
import { ProductList } from "@/features/product/components/product-list";
import { Ratings } from "@/features/product/components/ratings";
import { tryCatch } from "@/lib/try-catch";
import { formatPrice } from "@/lib/utils";

interface Props {
  params: Promise<{ productId: string }>;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { productId } = await params;

  const { data: product, error } = await tryCatch(
    db.query.products.findFirst({
      where: (f, o) => o.eq(f.id, Number(productId)),
      columns: {
        title: true,
        description: true,
      },
    })
  );

  if (error || !product) {
    return;
  }

  return {
    title: product.title,
    description: product.description,
  };
}

export default async function Page({ params }: Props) {
  const { productId } = await params;

  const { data: product, error } = await tryCatch(
    db.query.products.findFirst({
      where: (f, o) => o.eq(f.id, Number(productId)),
      columns: {
        title: true,
        description: true,
        images: true,
        price: true,
        discountedPrice: true,
      },
    })
  );

  if (error || !product) {
    notFound();
  }

  return (
    <main>
      <div className="mx-auto max-w-7xl px-4 xl:px-0">
        <Breadcrumb className="my-6 pl-1">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/products">Products</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <section className="mb-11">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <ProductImageGallery images={product.images} />
            </div>
            <div>
              <h1 className="mb-3 text-2xl font-semibold capitalize md:mb-3.5 md:text-5xl">
                {product.title}
              </h1>
              <div className="mb-3 flex items-center sm:mb-3.5">
                <Ratings
                  initialValue={4.2}
                  allowFraction
                  SVGclassName="inline-block"
                  emptyClassName="fill-gray-50"
                  size={25}
                  readonly
                />
                <span className="ml-[11px] pb-0.5 text-xs text-black sm:ml-[13px] sm:pb-0 sm:text-sm">
                  4.2
                  <span className="text-black/60">/5</span>
                </span>
              </div>
              <div className="mb-5 flex items-center space-x-2.5 sm:space-x-3">
                {product.discountedPrice &&
                Number(product.discountedPrice) === 0 ? (
                  <span className="text-2xl font-bold text-black">
                    {formatPrice(product.price)}
                  </span>
                ) : (
                  <>
                    <span className="text-2xl font-bold text-black">
                      {formatPrice(product.discountedPrice)}
                    </span>
                    <span className="text-2xl font-bold text-black/40 line-through">
                      {formatPrice(product.price)}
                    </span>
                    <span className="rounded-full bg-[#FF3333]/10 px-3.5 py-1.5 text-sm font-medium text-[#FF3333]">
                      {(
                        (Number(product.discountedPrice) /
                          Number(product.price)) *
                          100 -
                        100
                      ).toFixed(2)}
                      %
                    </span>
                  </>
                )}
              </div>
              <p className="text-muted-foreground mb-5 text-sm sm:text-base">
                {product.description}
              </p>
              <Separator className="my-5 hidden md:block" />
              <div className="fixed bottom-0 left-0 z-10 flex w-full items-center justify-between border-t border-black/5 bg-white p-4 sm:justify-start md:relative md:justify-center md:border-none md:p-0">
                <CartCounter />
                <AddToCartButton />
              </div>
            </div>
          </div>
        </section>
        <ProductDetailsTabs
          details={[
            {
              label: "Material composition",
              value: "100% Cotton",
            },
            {
              label: "Care instructions",
              value: "Machine wash warm, tumble dry",
            },
            {
              label: "Fit type",
              value: "Classic Fit",
            },
            {
              label: "Pattern",
              value: "Solid",
            },
          ]}
        />
      </div>
      <div className="mb-[50px] sm:mb-20">
        <ProductList
          title="Related Products"
          description="You might also like"
          productsPromise={getNewArrivals()}
        />
      </div>
    </main>
  );
}
