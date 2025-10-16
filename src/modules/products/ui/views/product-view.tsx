"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckCheck, Share2 } from "lucide-react";
import { toast } from "sonner";

import { StarRating } from "@/components/star-rating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import type { Category } from "@/payload-types";
import { useTRPC } from "@/trpc/client";

import { ProductBreadcrumb } from "../components/product-breadcrumb";

const CartButton = dynamic(
  () => import("../components/cart-button").then((mod) => mod.CartButton),
  {
    ssr: false,
    loading: () => <Skeleton className="h-14 w-full" />,
  },
);

interface Props {
  productId: string;
  storeSubdomain: string;
}

export function ProductView({ productId, storeSubdomain }: Props) {
  const [isShared, setIsShared] = useState<boolean>(false);

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({
      id: productId,
    }),
  );

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Copied! You can share it anywhere");
    setIsShared(true);

    setTimeout(() => setIsShared(false), 3_000);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ProductBreadcrumb
        title={data.title}
        parentCategoryLabel={(data.category?.parent as Category).label}
        parentCategorySlug={(data.category?.parent as Category).slug}
        subcategoryLabel={data.category?.label}
        subcategorySlug={data.category?.slug}
      />
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <Card className="overflow-hidden border-border/40 bg-background/70 py-0 shadow-lg backdrop-blur-sm">
            <div className="group relative aspect-video">
              <Image
                src={data.image?.url || "/placeholder.png"}
                alt={data.title}
                className="h-full w-full object-cover"
                fill
              />
            </div>
          </Card>
          <Card className="border-border/40 bg-background/70 shadow-lg backdrop-blur-sm">
            <div className="px-6">
              {data.description ? (
                <p>{data.description}</p>
              ) : (
                <p className="font-medium text-muted-foreground italic">
                  No description provided
                </p>
              )}
            </div>
          </Card>
        </div>
        <div className="space-y-6 lg:col-span-5">
          <Card className="border-border/40 bg-background/70 shadow-lg backdrop-blur-sm">
            <CardContent className="p-8 py-0">
              <div className="space-y-6">
                <h1 className="font-bold text-3xl leading-tight">
                  {data.title}
                </h1>
                <StarRating
                  reviewRating={data.reviewRating}
                  reviewCount={data.reviewCount}
                />
                <div className="flex items-baseline space-x-2">
                  <span className="font-bold text-4xl">
                    {data.discountType === "flat"
                      ? formatCurrency(
                          Math.round(data.price - data.discountValue),
                        )
                      : formatCurrency(
                          Math.round(
                            data.price -
                              (data.price * data.discountValue) / 100,
                          ),
                        )}
                  </span>
                  {data.discountValue > 0 && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatCurrency(Math.round(data.price))}
                    </span>
                  )}
                  {data.discountValue > 0 && data.price > 0 && (
                    <Badge className="bg-green-100 text-green-800">
                      {data.discountType === "percentage"
                        ? Math.round(data.discountValue)
                        : Math.round((data.discountValue / data.price) * 100)}
                      % OFF
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-3 rounded-xl bg-muted/60 p-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={data.tenant.avatar?.url || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {data.tenant.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-bold text-foreground text-lg">
                    {data.tenant.name}
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex w-full items-center gap-2">
                    <CartButton
                      isPurchased={data.isPurchased}
                      storeSubdomain={storeSubdomain}
                      productId={productId}
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-14"
                      onClick={handleShare}
                      disabled={isShared}
                    >
                      {isShared ? (
                        <CheckCheck className="size-6" />
                      ) : (
                        <Share2 className="size-6" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-background/70 shadow-lg backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center space-x-3">
                  <div className="flex w-14 items-center">
                    <span className="font-medium text-sm">
                      {stars} {stars === 1 ? "star" : "stars"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <Progress
                      value={data.ratingDistribution[stars]}
                      className="h-2"
                    />
                  </div>
                  <span className="w-12 text-right text-muted-foreground text-sm">
                    {data.ratingDistribution[stars]}%
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
