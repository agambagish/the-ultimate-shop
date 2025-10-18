"use client";

import Image from "next/image";
import Link from "next/link";

import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  id: number;
  title: string;
  imageUrl?: string | null;
  storeName: string;
  storeAvatarUrl?: string | null;
}

export function PurchasedProductCard({
  id,
  storeName,
  title,
  imageUrl,
  storeAvatarUrl,
}: Props) {
  return (
    <Link href={`/library/${id}`}>
      <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/40 bg-background/60 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-border/60 hover:bg-background/90 hover:shadow-2xl active:scale-[0.98]">
        <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-muted">
          <Image
            src={imageUrl || "/placeholder.png"}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            fill
          />
        </div>
        <div className="flex flex-1 flex-col justify-between space-y-3">
          <h3 className="line-clamp-2 font-bold text-lg leading-tight transition-colors duration-200 group-hover:text-primary">
            {title}
          </h3>
          <div className="flex items-center gap-1.5 transition-opacity duration-200 group-hover:opacity-80">
            {storeAvatarUrl && (
              <Image
                alt={storeName}
                src={storeAvatarUrl}
                width={16}
                height={16}
                className="size-4 shrink-0 rounded-full"
              />
            )}
            <p className="truncate text-muted-foreground text-sm transition-colors duration-200 group-hover:text-foreground">
              {storeName}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function PurchasedProductCardSkeleton() {
  return <Skeleton className="aspect-[3/4] w-full rounded-2xl" />;
}
