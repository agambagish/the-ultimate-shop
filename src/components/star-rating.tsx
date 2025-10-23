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
        {Array.from({ length: MAX_RATING }).map((_, index) => {
          const full = index + 1 <= Math.floor(safeRating);
          const half = !full && index < safeRating && safeRating < index + 1;

          return (
            <div key={index.toString()} className="relative">
              <Star className={cn("size-5 text-gray-300", iconClassName)} />
              {(full || half) && (
                <Star
                  className={cn(
                    "absolute top-0 left-0 size-5 fill-yellow-400 text-yellow-400",
                    iconClassName,
                  )}
                  style={{
                    clipPath: half ? "inset(0 50% 0 0)" : "none",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      <span className="font-semibold text-foreground">
        {safeRating.toFixed(1)}
      </span>
      <span className="text-muted-foreground">({reviewCount} reviews)</span>
    </div>
  );
}
