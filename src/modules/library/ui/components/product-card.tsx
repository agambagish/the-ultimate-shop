import Image from "next/image";
import Link from "next/link";

import { Star } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  id: number;
  title: string;
  imageUrl?: string | null;
  storeSubdomain: string;
  storeAvatarUrl?: string | null;
  reviewRating: number;
  reviewCount: number;
}

export function ProductCard({
  id,
  reviewCount,
  reviewRating,
  storeSubdomain,
  title,
  imageUrl,
  storeAvatarUrl,
}: Props) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-border/40 bg-white/60 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white/80 hover:shadow-xl">
      <Link href={`/library/${id}`}>
        <div className="relative mb-4 aspect-square overflow-hidden rounded-xl">
          <Image
            src={imageUrl || "/placeholder.png"}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            fill
          />
        </div>
      </Link>
      <div className="space-y-3">
        <h3 className="font-bold text-lg leading-tight underline-offset-2 hover:underline">
          <Link href={`/library/${id}`}>{title}</Link>
        </h3>
        <div className="flex items-center gap-2 hover:cursor-pointer">
          {storeAvatarUrl && (
            <Image
              alt={storeSubdomain}
              src={storeAvatarUrl}
              width={17}
              height={17}
              className="size-[17px] shrink-0 rounded-full border border-black"
            />
          )}
          <p className="text-muted-foreground text-sm underline underline-offset-2 hover:text-muted-foreground/85">
            {storeSubdomain}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Star className="size-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-sm">{reviewRating}</span>
          </div>
          <span className="text-muted-foreground text-sm">({reviewCount})</span>
        </div>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return <Skeleton className="aspect-[3/4] w-full rounded-2xl" />;
}
