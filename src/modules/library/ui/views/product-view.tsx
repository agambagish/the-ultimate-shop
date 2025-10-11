"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { ReviewSidebar } from "../components/review-sidebar";

interface Props {
  productId: string;
}

export function ProductView({ productId }: Props) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.library.getOne.queryOptions({
      productId,
    }),
  );

  return (
    <>
      <header className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="font-bold text-3xl">{data.title}</h1>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-7 lg:gap-16">
          <div className="lg:col-span-2">
            <div className="gap-4 rounded-md border p-4">
              <ReviewSidebar productId={productId} />
            </div>
          </div>
          <div className="lg:col-span-5">
            <p className="font-medium text-muted-foreground italic">
              No special content
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
