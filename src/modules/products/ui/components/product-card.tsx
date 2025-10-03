import Image from "next/image";
import Link from "next/link";

import { Star } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { formatAsCurrency } from "@/lib/utils";

interface Props {
  id: number;
  title: string;
  imageUrl?: string | null;
  storeSubdomain: string;
  storeAvatarUrl?: string | null;
  reviewRating: number;
  reviewCount: number;
  price: number;
}

export function ProductCard({
  id,
  price,
  reviewCount,
  reviewRating,
  storeSubdomain,
  title,
  imageUrl,
  storeAvatarUrl,
}: Props) {
  return (
    <Link href={`/products/${id}`}>
      <div className="group overflow-hidden rounded-2xl border border-border/40 bg-white/60 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white/80 hover:shadow-xl">
        <div className="relative mb-4 aspect-square overflow-hidden rounded-xl">
          <Image
            src={imageUrl || "/placeholder.png"}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            fill
          />
        </div>
        <div className="space-y-3">
          <h3 className="font-semibold text-lg leading-tight transition-colors group-hover:text-primary">
            {title}
          </h3>
          <div className="flex items-center gap-2">
            {storeAvatarUrl && (
              <Image
                alt={storeSubdomain}
                src={storeAvatarUrl}
                width={16}
                height={16}
                className="size-[16px] shrink-0 rounded-full border"
              />
            )}
            <p className="text-muted-foreground text-sm">{storeSubdomain}</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Star className="size-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-sm">{reviewRating}</span>
            </div>
            <span className="text-muted-foreground text-sm">
              ({reviewCount})
            </span>
          </div>
          <div className="pt-2 font-bold text-xl">
            {formatAsCurrency(`${price}`)}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return <Skeleton className="aspect-[3/4] w-full rounded-2xl" />;
}
