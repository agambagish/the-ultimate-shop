import Image from "next/image";

import { Loader2Icon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Product } from "@/db/schema";
import { formatPrice } from "@/lib/utils";

type CartItem = Pick<
  Product,
  "title" | "slug" | "price" | "discountPercentage" | "thumbnailImageURL"
> & {
  category: string;
};

interface Props {
  isLoading: boolean;
  cart: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
}

export function CheckoutSummary({
  cart,
  discount,
  isLoading,
  subtotal,
  total,
}: Props) {
  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2Icon className="text-muted-foreground size-6 animate-spin" />
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={item.thumbnailImageURL}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="line-clamp-1 text-sm font-medium">
                      {item.title}
                    </p>
                    <div className="mt-1 flex justify-between">
                      <span className="space-x-2 text-sm">
                        {item.discountPercentage > 0 ? (
                          <>
                            <span className="text-muted-foreground line-through">
                              {formatPrice(Number(item.price))}
                            </span>
                            <span>
                              {formatPrice(
                                Math.round(
                                  Number(item.price) -
                                    (Number(item.price) *
                                      item.discountPercentage) /
                                      100
                                )
                              )}
                            </span>
                          </>
                        ) : (
                          formatPrice(item.price)
                        )}
                      </span>
                      <span className="text-sm">Qty: 1</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Discount</span>
                <span>{formatPrice(discount)}</span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="bg-muted/40 mt-4 rounded-lg p-3 text-xs">
              <p className="mb-1 font-medium">Order Protection</p>
              <p className="text-muted-foreground">
                All purchases are secured with 256-bit SSL encryption and come
                with a 30-day money-back guarantee.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
