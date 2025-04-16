import { Separator } from "@/components/ui/separator";
import { SheetFooter, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

export function CartSheetItemsSkeleton() {
  return (
    <>
      <div className="h-full">
        <div className="flex w-full flex-1 flex-col gap-5 px-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="xs:flex-row flex flex-col items-start justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="relative aspect-square size-16 min-w-fit rounded" />
                  <div className="flex flex-col space-y-1 self-start">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="xs:w-auto xs:justify-normal flex w-full items-center justify-between space-x-2">
                  <div className="flex items-center space-x-0.5">
                    <Skeleton className="size-8 rounded-r-none" />
                    <Skeleton className="h-8 w-14 rounded-none" />
                    <Skeleton className="size-8 rounded-l-none" />
                  </div>
                  <Skeleton className="size-8" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4 px-6">
        <Separator />
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="flex-1">Shipping</span>
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex justify-between">
            <span className="flex-1">Taxes</span>
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex justify-between">
            <span className="flex-1">Total</span>
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <SheetFooter>
          <SheetTrigger asChild>
            <Skeleton className="h-9 w-full rounded-md" />
          </SheetTrigger>
        </SheetFooter>
      </div>
    </>
  );
}
