import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArchiveIcon,
  FileIcon,
  FileTextIcon,
  HeartIcon,
  ImageIcon,
  LockIcon,
  Share2Icon,
  StarIcon,
} from "lucide-react";

import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatBytes, formatDate, formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/modules/product/components/add-to-cart-button";
import { AssetDownloadButton } from "@/modules/product/components/asset-download-button";
import { ProductPreview } from "@/modules/product/components/product-preview";
import { getProduct } from "@/modules/product/server/get-product";
import { getRelatedProducts } from "@/modules/product/server/get-related-products";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: Props) {
  const _params = await params;

  const product = await getProduct(_params.slug);

  if (!product) {
    notFound();
  }

  const isPurchased = !!product.orderId;

  const relatedProducts = await getRelatedProducts(_params.slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:py-8">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="space-y-6">
          <ProductPreview product={product} />
        </div>
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex items-center gap-4">
              <Link
                href={`/stores/${product.storeSlug}`}
                className="text-muted-foreground text-sm hover:underline"
              >
                {product.storeName}
              </Link>
              <div className="flex items-center">
                <StarIcon className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-muted-foreground ml-1 text-sm">
                  {"(0 reviews)"}
                </span>
              </div>
            </div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <div className="mt-4 flex items-center gap-3">
              <div className="space-x-2 text-2xl font-bold">
                {product.discountPercentage > 0 ? (
                  <>
                    <span className="text-muted-foreground line-through">
                      {formatPrice(product.price)}
                    </span>
                    <span>
                      {formatPrice(
                        Number(product.price) -
                          (Number(product.price) * product.discountPercentage) /
                            100
                      )}
                    </span>
                  </>
                ) : (
                  formatPrice(product.price)
                )}
              </div>
              {product.discountPercentage > 0 && (
                <Badge variant="secondary" className="bg-green-600 text-white">
                  {product.discountPercentage}% OFF
                </Badge>
              )}
            </div>
          </div>
          <p className="text-muted-foreground">{product.description}</p>
          <div>
            <Card
              className={cn(
                "py-4 transition-all duration-300",
                !isPurchased && "bg-muted/30"
              )}
            >
              <CardHeader className="">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {!isPurchased && (
                      <LockIcon className="text-muted-foreground h-5 w-5" />
                    )}
                    Product Assets
                  </CardTitle>
                  {isPurchased && (
                    <Badge
                      variant="secondary"
                      className="bg-green-600 text-white"
                    >
                      Purchased
                    </Badge>
                  )}
                </div>
                {!isPurchased && (
                  <p className="text-muted-foreground text-sm">
                    Purchase this product to unlock and download these assets
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <div
                  className={cn(
                    "flex items-center justify-between rounded-lg border p-3 transition-all",
                    isPurchased
                      ? "bg-background hover:bg-muted/50"
                      : "bg-muted/50 opacity-60"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "rounded-md p-2",
                        isPurchased
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {getFileIcon(product.productAssetMimeType)}
                    </div>
                    <div>
                      <div className="line-clamp-1 text-sm font-medium">
                        {product.productAssetFileName}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {formatBytes(product.productAssetSize)}
                      </div>
                    </div>
                  </div>
                  <AssetDownloadButton
                    slug={_params.slug}
                    assetCID={product.productAssetPinataCID}
                  />
                </div>
                {!isPurchased && (
                  <div className="border-t pt-3">
                    <p className="text-muted-foreground text-center text-xs">
                      🔒 Assets will be available immediately after purchase
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="mx-2 flex flex-col gap-2 sm:flex-row">
            <AddToCartButton slug={_params.slug} />
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" size="sm">
              <HeartIcon className="mr-2 h-4 w-4" />
              Favorite
            </Button>
            <Button variant="ghost" size="sm">
              <Share2Icon className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
          <Separator />
          <div className="flex">
            <span className="text-muted-foreground w-32">Last Updated:</span>
            <span>{formatDate(product.updatedAt)}</span>
          </div>
        </div>
      </div>
      <div className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews {"(0)"}</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: product.longDescription }}
            />
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            {/* <ProductReviews productId={product.id} /> */}
            ProductReviews
          </TabsContent>
          <TabsContent value="support" className="mt-6">
            <div className="prose max-w-none">
              <h3>Support Information</h3>
              <p>
                For support with this product, please contact the vendor
                directly through their profile page or use the contact form
                below.
              </p>
              <Button className="mt-4">Contact Vendor</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <section className="mt-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Related Products
          </h2>
          <Button variant="link" size="sm">
            View all
          </Button>
        </div>
        {relatedProducts.length === 0 && (
          <div className="flex justify-center py-12">
            <p className="text-muted-foreground text-sm">
              There&apos;s no related products at this time
            </p>
          </div>
        )}
        {relatedProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((product, i) => (
              <ProductCard key={i} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function getFileIcon(fileType: string) {
  const type = fileType.toLowerCase();
  if (type.includes("pdf")) return <FileTextIcon className="h-5 w-5" />;
  if (type.includes("zip") || type.includes("rar"))
    return <ArchiveIcon className="h-5 w-5" />;
  if (type.includes("svg") || type.includes("png") || type.includes("jpg"))
    return <ImageIcon className="h-5 w-5" />;
  return <FileIcon className="h-5 w-5" />;
}
