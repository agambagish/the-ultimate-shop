import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main>
      <div className="mx-auto max-w-7xl px-4 xl:px-0">
        <div className="my-6 pl-1">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-2" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <section className="mb-11">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
            <div>
              <Skeleton className="mb-3 h-10 w-3/4 md:mb-3.5 md:h-16" />
              <div className="mb-3 flex items-center space-x-3">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-10" />
              </div>
              <div className="mb-5 flex items-center space-x-3">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16 rounded-full" />
              </div>
              <Skeleton className="mb-5 h-20 w-full" />
              <div className="my-5 hidden md:block">
                <Skeleton className="h-px w-full" />
              </div>
              <div className="fixed bottom-0 left-0 z-10 flex w-full justify-between border-t border-black/5 bg-white p-4 sm:justify-start md:relative md:justify-center md:border-none md:p-0">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </section>
        <div className="mb-10">
          <Skeleton className="mb-3 h-8 w-40" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
      <section className="mx-auto mb-[50px] max-w-7xl text-center sm:mb-20">
        <div className="mb-8 md:mb-12">
          <Skeleton className="mx-auto mb-4 h-8 w-56 md:h-10 md:w-72" />
          <Skeleton className="mx-auto h-5 w-72 md:w-96" />
        </div>
        <div className="mb-6 w-full md:mb-9">
          <div className="flex space-x-4 overflow-x-auto px-4 xl:px-0">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-full max-w-[198px] shrink-0 sm:max-w-[295px]"
              >
                <Skeleton className="h-64 w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
