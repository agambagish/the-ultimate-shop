"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { ShoppingBagIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CartSheetItems } from "@/features/cart/components/cart-sheet-items";
import { CartSheetItemsSkeleton } from "@/features/cart/components/cart-sheet-items-skeleton";
import { useCart } from "@/features/cart/hooks/use-cart";
import { getCart } from "@/features/cart/queries";
import { cn } from "@/lib/utils";

export function CartSheet() {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const { totalItems, items } = useCart();
  const itemCount = totalItems();

  const {
    mutate,
    data: cart,
    isPending,
  } = useMutation({
    mutationFn: getCart,
  });

  useEffect(() => {
    mutate(items);
    setIsMounted(true);
  }, [items, mutate]);

  if (!isMounted) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative size-8 cursor-pointer"
        >
          {itemCount > 0 && (
            <Badge
              variant="secondary"
              className="absolute -top-2 -right-2 size-2.5 justify-center rounded-full p-2.5"
            >
              {itemCount}
            </Badge>
          )}
          <ShoppingBagIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>Cart {itemCount > 0 && `(${itemCount})`}</SheetTitle>
          <Separator />
        </SheetHeader>
        {itemCount > 0 ? (
          isPending ? (
            <CartSheetItemsSkeleton />
          ) : (
            <CartSheetItems cart={cart!} />
          )
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <ShoppingBagIcon className="text-muted-foreground mb-4 size-16" />
            <div className="text-muted-foreground text-xl font-medium">
              Your cart is empty
            </div>
            <SheetTrigger asChild>
              <Link
                aria-label="Add items to your cart to checkout"
                href="/products"
                className={cn(
                  buttonVariants({
                    variant: "link",
                    size: "sm",
                    className: "text-muted-foreground text-sm",
                  })
                )}
              >
                Add items to your cart to checkout
              </Link>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
