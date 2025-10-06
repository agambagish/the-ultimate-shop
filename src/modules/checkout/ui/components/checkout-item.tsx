import Image from "next/image";
import Link from "next/link";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

interface Props {
  isLast?: boolean;
  imageUrl?: string | null;
  title: string;
  productUrl: string;
  storeUrl: string;
  storeName: string;
  price: number;
  onRemove: () => void;
  disabled?: boolean;
}

export function CheckoutItem({
  onRemove,
  price,
  productUrl,
  storeName,
  storeUrl,
  title,
  imageUrl,
  isLast,
  disabled,
}: Props) {
  return (
    <>
      <div className="flex items-start space-x-4">
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl">
          <Image
            src={imageUrl || "/placeholder.png"}
            alt={title}
            className="h-full w-full object-cover"
            fill
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold leading-tight underline-offset-2 hover:underline">
                <Link href={productUrl}>{title}</Link>
              </h3>
              <p className="text-muted-foreground text-sm underline underline-offset-2 hover:text-muted-foreground/85">
                <Link href={storeUrl}>by {storeName}</Link>
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="size-6 cursor-pointer p-1 text-muted-foreground hover:text-destructive"
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-3">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg">{formatCurrency(price)}</span>
              <span className="text-muted-foreground text-sm line-through">
                {formatCurrency(Math.round(price * 1.4))}
              </span>
            </div>
          </div>
        </div>
      </div>
      {!isLast && <Separator className="mt-4" />}
    </>
  );
}
