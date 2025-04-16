"use client";

import Image from "next/image";
import Link from "next/link";

import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SheetFooter, SheetTrigger } from "@/components/ui/sheet";
import type { products } from "@/db/schema";
import { useCart } from "@/features/cart/hooks/use-cart";
import { formatPrice } from "@/lib/utils";

interface Props {
  cart: (Pick<
    typeof products.$inferSelect,
    "id" | "title" | "price" | "images"
  > & {
    qty: number;
    category: string;
  })[];
}

export function CartSheetItems({ cart }: Props) {
  const { incrementQty, decrementQty, removeItem } = useCart();

  const cartTotal = cart.reduce(
    (total, item) => total + item.qty * Number(item.price),
    0
  );

  return (
    <>
      <ScrollArea className="h-full">
        <div className="flex w-full flex-1 flex-col gap-5 px-6">
          {cart.map((item) => (
            <div key={item.id} className="space-y-3">
              <div className="xs:flex-row flex flex-col items-start justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="relative aspect-square size-16 min-w-fit overflow-hidden rounded">
                    <Image
                      src={item.images[0]}
                      alt={item.title}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      fill
                      className="absolute object-cover"
                    />
                  </div>
                  <div className="flex flex-col space-y-1 self-start">
                    <span className="line-clamp-1 text-sm font-medium">
                      {item.title}
                    </span>
                    <span className="text-muted-foreground line-clamp-1 text-xs">
                      {formatPrice(item.price)} x {item.qty} ={" "}
                      {formatPrice(
                        (Number(item.price) * Number(item.qty)).toFixed(2)
                      )}
                    </span>
                    <span className="text-muted-foreground line-clamp-1 text-xs capitalize">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="xs:w-auto xs:justify-normal flex w-full items-center justify-between space-x-2">
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8 rounded-r-none"
                      onClick={() => decrementQty(item.id)}
                    >
                      <MinusIcon className="size-3" />
                    </Button>
                    <Input
                      type="number"
                      min="0"
                      className="h-8 w-14 rounded-none border-x-0"
                      value={item.qty}
                      readOnly
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8 rounded-l-none"
                      onClick={() => incrementQty(item.id)}
                    >
                      <PlusIcon className="size-3" />
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2Icon className="size-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="space-y-4 px-6">
        <Separator />
        <div className="space-y-1.5 text-sm">
          <div className="flex">
            <span className="flex-1">Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex">
            <span className="flex-1">Taxes</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="flex">
            <span className="flex-1">Total</span>
            <span>{formatPrice(cartTotal.toFixed(2))}</span>
          </div>
        </div>
        <SheetFooter>
          <SheetTrigger asChild>
            <Link
              href="/cart"
              className={buttonVariants({
                size: "sm",
                className: "w-full",
              })}
            >
              Continue to checkout
            </Link>
          </SheetTrigger>
        </SheetFooter>
      </div>
    </>
  );
}
