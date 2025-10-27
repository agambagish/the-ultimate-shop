"use client";

import Link from "next/link";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

import { ReviewSidebar } from "../components/review-sidebar";

interface Props {
  productId: string;
}

export function PurchasedProductView({ productId }: Props) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.library.getOne.queryOptions({
      productId,
    }),
  );

  if (!data) {
    return <div>TODO: Add Error Placeholder</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/library"
          className="mb-4 inline-flex items-center space-x-2 text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Library</span>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-3xl text-foreground">
              Order #{data.order.id}
            </span>
            <div className="mt-2 flex items-center space-x-4">
              <Badge className="border-green-200 bg-green-100 p-1.5 text-green-800">
                <CheckCircle className="mr-1 h-3 w-3" />
                Completed
              </Badge>
              <span className="text-muted-foreground">
                Placed on {formatDateTime(data.order.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        <ReviewSidebar
          productId={data.product.id.toString()}
          paymentDetails={data.order.paymentDetails}
          purchasedPrice={data.order.price}
          purchasedDiscountedPrice={data.order.discounted_price}
        />
        <div className="md:col-span-8">
          <p className="font-medium text-muted-foreground italic">
            No special content
          </p>
        </div>
      </div>
    </div>
  );
}
