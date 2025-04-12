import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col items-start">
      <div className="mb-2.5 aspect-square w-full overflow-hidden rounded-[13px] lg:max-w-[295px] lg:rounded-[20px] xl:mb-4">
        <Skeleton className="h-full w-full rounded-md" />
      </div>
      <Skeleton className="mb-2 h-5 w-3/4 xl:h-6" />
      <div className="mb-1 flex items-end space-x-2 xl:mb-2">
        <Skeleton className="h-5 w-[80px]" />
        <Skeleton className="h-4 w-8" />
      </div>
      <div className="flex items-center space-x-[5px] xl:space-x-2.5">
        <Skeleton className="h-6 w-16 xl:h-7 xl:w-20" />
        <Skeleton className="h-6 w-14 xl:h-7 xl:w-16" />
        <Skeleton className="h-6 w-12 rounded-full xl:h-7 xl:w-14" />
      </div>
    </div>
  );
}
