"use client";

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Star } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { calculateProductPricing } from "@/lib/calculate";
import type { TQueryResult } from "@/lib/types";
import { formatCurrency, generateStoreURL } from "@/lib/utils";

interface Props {
  product: TQueryResult<"products.getMany">["products"][number];
}

export function ProductCard({ product }: Props) {
  const router = useRouter();

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();

    router.push(generateStoreURL(product.stores!.subdomain));
  }

  const { discountedPrice, originalPrice } = calculateProductPricing(product);

  return (
    <Link
      href={`${generateStoreURL(product.stores!.subdomain)}/products/${product.id}`}
    >
      <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/40 bg-background/60 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-border/60 hover:bg-background/90 hover:shadow-2xl active:scale-[0.98]">
        <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-muted">
          <Image
            src={
              product.image_id
                ? `/api/images/${product.image_id}`
                : "/placeholder.png"
            }
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            fill
          />
        </div>
        <div className="flex flex-1 flex-col justify-between space-y-2">
          <h3 className="line-clamp-2 font-bold text-lg leading-tight transition-colors duration-200 group-hover:text-primary">
            {product.title}
          </h3>
          {/** biome-ignore lint/a11y/useKeyWithClickEvents: _ */}
          <div
            className="flex items-center gap-1.5 transition-opacity duration-200 group-hover:opacity-80"
            onClick={handleClick}
          >
            {product.stores!.avatar_id && (
              <Image
                alt={product.stores!.name}
                src={`/api/images/${product.stores!.avatar_id}`}
                width={16}
                height={16}
                className="size-4 shrink-0 rounded-full"
              />
            )}
            <p className="truncate text-muted-foreground text-sm transition-colors duration-200 hover:underline group-hover:text-foreground">
              {product.stores!.name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-xs">
                {product.reviewRating}
              </span>
            </div>
            <span className="text-muted-foreground text-xs">
              ({product.reviewCount})
            </span>
          </div>
          <div className="flex items-center space-x-2 pt-1">
            <span className="font-bold text-foreground text-lg">
              {formatCurrency(discountedPrice)}
            </span>
            {originalPrice && (
              <span className="font-bold text-lg text-muted-foreground line-through">
                {formatCurrency(originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return <Skeleton className="aspect-[3/4] w-full rounded-2xl" />;
}
