"use client";

import Image from "next/image";
import Link from "next/link";

import { Trash2Icon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@/db/schema";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";

interface Props {
  item: Pick<
    Product,
    "title" | "slug" | "price" | "discountPercentage" | "thumbnailImageURL"
  > & { category: string };
}

export function CartItem({ item }: Props) {
  const { removeItem } = useCart();

  return (
    <div className="flex gap-3">
      <div className="relative size-20 flex-shrink-0 overflow-hidden rounded-md">
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
          className="line-clamp-1 text-sm font-medium hover:underline"
        >
          {item.title}
        </Link>
        <div className="mt-1 flex items-center">
          <Badge variant="secondary" className="text-xs">
            {item.category}
          </Badge>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="space-x-2 text-sm font-medium">
            {item.discountPercentage > 0 ? (
              <>
                <span className="text-muted-foreground line-through">
                  {formatPrice(Math.round(Number(item.price)))}
                </span>
                <span>
                  {formatPrice(
                    Math.round(
                      Number(item.price) -
                        (Number(item.price) * item.discountPercentage) / 100
                    )
                  )}
                </span>
              </>
            ) : (
              formatPrice(item.price)
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => removeItem(item.slug)}
          >
            <Trash2Icon />
          </Button>
        </div>
      </div>
    </div>
  );
}
