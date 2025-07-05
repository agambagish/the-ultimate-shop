import Image from "next/image";
import Link from "next/link";

import {
  ArchiveIcon,
  CalendarIcon,
  CreditCardIcon,
  DownloadIcon,
  EyeIcon,
  FileIcon,
  FileTextIcon,
  ImageIcon,
  PackageIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn, formatBytes, formatDate, formatPrice } from "@/lib/utils";
import { getOrders } from "@/modules/order/server/get-orders";
import { AssetDownloadButton } from "@/modules/product/components/asset-download-button";

const filter = "all";

export default async function Page() {
  const orders = await getOrders();

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-muted-foreground mt-1">
            View and download your purchased digital assets
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Select value="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
          <Select value="newest">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="amount-high">Amount: High to Low</SelectItem>
              <SelectItem value="amount-low">Amount: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {orders.length === 0 ? (
        <Card className="p-12 text-center">
          <PackageIcon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="mb-2 text-xl font-semibold">No orders found</h3>
          <p className="text-muted-foreground mb-6">
            {filter === "all"
              ? "You haven't made any purchases yet."
              : `No orders with status "${filter}" found.`}
          </p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader>
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <span>Order #{order.id}</span>
                      <Badge
                        variant={!order.isPaid ? "destructive" : "outline"}
                        className={cn(
                          order.isPaid && "bg-green-600 text-white"
                        )}
                      >
                        {order.isPaid ? "Paid" : "Pending"}
                      </Badge>
                    </CardTitle>
                    <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {formatDate(order.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <CreditCardIcon className="h-4 w-4" />
                        {formatPrice(order.totalAmount)}
                      </div>
                      <div className="flex items-center gap-1">
                        <PackageIcon className="h-4 w-4" />
                        {order.itemCount} item
                        {order.itemCount > 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {order.items.map((item, i) => (
                    <div key={i}>
                      <div className="flex flex-col gap-6 lg:flex-row">
                        <div className="flex gap-4 lg:w-1/3">
                          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                            <Image
                              src={item.thumbnailImageURL}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-grow">
                            <Link
                              href={`/products/${item.slug}`}
                              className="line-clamp-2 font-semibold hover:underline"
                            >
                              {item.title}
                            </Link>
                            <div className="mt-2 font-medium">
                              {formatPrice(item.priceAtPurchase)}
                            </div>
                          </div>
                        </div>
                        <div className="lg:w-2/3">
                          {order.isPaid && (
                            <div>
                              <h4 className="mb-3 flex items-center gap-2 font-medium">
                                <DownloadIcon className="h-4 w-4" />
                                Available Downloads
                              </h4>
                              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                <div className="bg-background hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors">
                                  <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 text-primary rounded-md p-2">
                                      {getFileIcon(item.productAssetMimeType)}
                                    </div>
                                    <div>
                                      <div className="line-clamp-1 text-sm font-medium">
                                        {item.productAssetFileName}
                                      </div>
                                      <div className="text-muted-foreground text-xs">
                                        {formatBytes(item.productAssetSize)}
                                      </div>
                                    </div>
                                  </div>
                                  <AssetDownloadButton
                                    assetCID={item.productAssetPinataCID}
                                    slug={item.slug}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      {i < order.itemCount - 1 && (
                        <Separator className="mt-6" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t pt-6 sm:flex-row sm:items-center">
                  <div className="text-muted-foreground text-sm">
                    Need help with this order?{" "}
                    <Link
                      href="/support"
                      className="text-primary hover:underline"
                    >
                      Contact Support
                    </Link>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/orders/${order.id}`}>
                        <EyeIcon className="h-4 w-4" />
                        View Details
                      </Link>
                    </Button>
                    {order.isPaid && (
                      <Button variant="outline" size="sm">
                        Download Invoice
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function getFileIcon(fileType: string) {
  const type = fileType.toLowerCase();
  if (type.includes("pdf")) return <FileTextIcon className="h-5 w-5" />;
  if (type.includes("zip") || type.includes("rar"))
    return <ArchiveIcon className="h-5 w-5" />;
  if (type.includes("svg") || type.includes("png") || type.includes("jpg"))
    return <ImageIcon className="h-5 w-5" />;
  return <FileIcon className="h-5 w-5" />;
}
