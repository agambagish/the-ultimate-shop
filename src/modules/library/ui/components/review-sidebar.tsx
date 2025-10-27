import { useSuspenseQuery } from "@tanstack/react-query";
import { AtSign, Landmark, Percent, ReceiptIndianRupee } from "lucide-react";

import { UPILogo } from "@/components/upi-logo";
import { formatCurrency } from "@/lib/utils";
import type { Order } from "@/payload-types";
import { useTRPC } from "@/trpc/client";

import { ReviewForm } from "./review-form";

interface Props {
  productId: string;
  paymentDetails: Order["paymentDetails"];
  purchasedPrice: number;
  purchasedDiscountedPrice: number;
}

export function ReviewSidebar({
  productId,
  paymentDetails,
  purchasedPrice,
  purchasedDiscountedPrice,
}: Props) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.reviews.getOne.queryOptions({
      productId,
    }),
  );

  return (
    <div className="space-y-6 md:col-span-4">
      <div className="rounded-lg border border-border/40 bg-background/70 p-4 backdrop-blur-sm">
        <ReviewForm productId={productId} initialData={data} />
      </div>
      <div className="rounded-lg border border-border/40 bg-background/70 p-4 backdrop-blur-sm">
        <h3 className="mb-3 font-semibold text-base text-foreground">
          Price Details
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <ReceiptIndianRupee className="h-3.5 w-3.5" />
              Price
            </span>
            <div className="flex items-center space-x-2">
              <span className="font-medium">
                {formatCurrency(purchasedDiscountedPrice)}
              </span>
              {purchasedPrice !== purchasedDiscountedPrice && (
                <span className="font-medium text-muted-foreground line-through">
                  {formatCurrency(purchasedPrice)}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Percent className="h-3.5 w-3.5" />
              Discount
            </span>
            <span className="truncate font-medium text-green-600">
              {Math.round(
                ((purchasedPrice - purchasedDiscountedPrice) / purchasedPrice) *
                  100,
              )}
              %
            </span>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-border/40 bg-background/70 p-4 backdrop-blur-sm">
        <h3 className="mb-3 font-semibold text-base text-foreground">
          Transaction Details
        </h3>
        <div className="space-y-2 text-sm">
          {paymentDetails[0]?.blockType === "upi" && (
            <>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Landmark className="h-3.5 w-3.5" />
                  Payment Method
                </span>
                <div className="flex items-center">
                  <UPILogo className="mr-1 size-4" />
                  <span className="font-medium">UPI</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <AtSign className="h-3.5 w-3.5" />
                  VPA
                </span>
                <span className="ml-2 truncate font-medium">
                  {paymentDetails[0].vpa}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
