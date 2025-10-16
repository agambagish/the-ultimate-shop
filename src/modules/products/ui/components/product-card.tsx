"use client";

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Star } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, generateStoreURL } from "@/lib/utils";

interface Props {
  id: number;
  title: string;
  imageUrl?: string | null;
  storeName: string;
  storeSubdomain: string;
  storeAvatarUrl?: string | null;
  reviewRating: number;
  reviewCount: number;
  price: number;
  discountType: "flat" | "percentage";
  discountValue: number;
}

export function ProductCard({
  id,
  price,
  reviewCount,
  reviewRating,
  storeName,
  storeSubdomain,
  title,
  imageUrl,
  storeAvatarUrl,
  discountType,
  discountValue,
}: Props) {
  const router = useRouter();

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();

    router.push(generateStoreURL(storeSubdomain));
  }

  return (
    <Link href={`${generateStoreURL(storeSubdomain)}/products/${id}`}>
      <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/40 bg-background/60 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-border/60 hover:bg-background/90 hover:shadow-2xl active:scale-[0.98]">
        <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-muted">
          <Image
            src={imageUrl || "/placeholder.png"}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            fill
          />
        </div>
        <div className="flex flex-1 flex-col justify-between space-y-2">
          <h3 className="line-clamp-2 font-bold text-lg leading-tight transition-colors duration-200 group-hover:text-primary">
            {title}
          </h3>
          {/** biome-ignore lint/a11y/useKeyWithClickEvents: _ */}
          <div
            className="flex items-center gap-1.5 transition-opacity duration-200 group-hover:opacity-80"
            onClick={handleClick}
          >
            {storeAvatarUrl && (
              <Image
                alt={storeSubdomain}
                src={storeAvatarUrl}
                width={16}
                height={16}
                className="size-4 shrink-0 rounded-full"
              />
            )}
            <p className="truncate text-muted-foreground text-sm transition-colors duration-200 hover:underline group-hover:text-foreground">
              {storeName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-xs">{reviewRating}</span>
            </div>
            <span className="text-muted-foreground text-xs">
              ({reviewCount})
            </span>
          </div>
          <div className="flex items-center space-x-2 pt-1">
            <span className="font-bold text-foreground text-lg">
              {discountType === "flat"
                ? formatCurrency(Math.round(price - discountValue))
                : formatCurrency(
                    Math.round(price - (price * discountValue) / 100),
                  )}
            </span>
            {discountValue > 0 && (
              <span className="font-bold text-lg text-muted-foreground line-through">
                {formatCurrency(Math.round(price))}
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
