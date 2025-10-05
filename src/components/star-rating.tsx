import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

const MAX_RATING = 5;
const MIN_RATING = 0;

interface Props {
  reviewRating: number;
  reviewCount: number;
  className?: string;
  iconClassName?: string;
}

export function StarRating({
  reviewRating,
  reviewCount,
  className,
  iconClassName,
}: Props) {
  const safeRating = Math.max(MIN_RATING, Math.min(reviewRating, MAX_RATING));

  return (
    <div className={cn("flex items-center space-x-2.5", className)}>
      <div className="flex items-center space-x-1">
        {Array.from({ length: MAX_RATING }).map((_, index) => (
          <Star
            key={index.toString()}
            className={cn(
              "size-5",
              index < safeRating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300",
              iconClassName,
            )}
          />
        ))}
      </div>
      <span className="font-semibold text-foreground">{reviewRating}</span>
      <span className="text-muted-foreground">({reviewCount} reviews)</span>
    </div>
  );
}
