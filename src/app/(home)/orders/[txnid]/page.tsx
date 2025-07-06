import Link from "next/link";
import { notFound } from "next/navigation";

import { CheckCircle2Icon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn, formatBytes, formatPrice } from "@/lib/utils";
import { getOrderByTxnid } from "@/modules/order/server/get-order-by-txnid";
import { AssetDownloadButton } from "@/modules/product/components/asset-download-button";

interface Props {
  params: Promise<{ txnid: string }>;
}

export default async function Page({ params }: Props) {
  const _params = await params;

  const order = await getOrderByTxnid(_params.txnid);

  if (!order) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:py-8">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2Icon className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold">Thank You for Your Purchase!</h1>
        <p className="text-muted-foreground mt-2">
          Your order has been confirmed and is being processed.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Order Confirmation</CardTitle>
          <CardDescription>Order #{order.id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-2 text-sm font-medium">Order Summary</h3>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="mb-2 flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="mb-2 flex justify-between">
                <span className="text-muted-foreground">Discount:</span>
                <span>{formatPrice(order.discount)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium">Downloads</h3>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="line-clamp-1 font-medium">
                          {item.productAssetFileName}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {formatBytes(item.productAssetSize)}
                        </p>
                      </div>
                      <AssetDownloadButton
                        assetCID={item.productAssetPinataCID}
                        slug={item.slug}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium">Next Steps</h3>
            <ul className="space-y-2 text-sm">
              <li>
                1. A confirmation email has been sent to your email address.
              </li>
              <li>2. You can download your purchases from orders page.</li>
              <li>3. For any issues, please contact our support team.</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col justify-center gap-4 sm:flex-row sm:justify-between">
          <Link
            href="/orders"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full sm:w-auto"
            )}
          >
            Go to Orders
          </Link>
          <Link
            href="/products"
            className={cn(buttonVariants(), "w-full sm:w-auto")}
          >
            Continue Shopping
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
