"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Loader2Icon, ShoppingBagIcon, Trash2Icon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { cn, formatPrice } from "@/lib/utils";

import { useCartSheetStates } from "../hooks/use-cart-sheet-states";
import { getCart } from "../server/get-cart";
import { CartItem } from "./cart-item";

export function CartSheet() {
  const { state, setState } = useCartSheetStates();

  const { items, getItemCount, clearCart } = useCart();
  const itemCount = getItemCount();

  useEffect(() => {
    if (state.isOpen) {
      (async () => {
        try {
          const data = await getCart(items);

          setState({ type: "SET_CART", payload: data.cart });
          setState({ type: "SET_SUBTOTAL", payload: data.subtotal });
          setState({ type: "SET_DISCOUNT", payload: data.discount });
          setState({ type: "SET_TOTAL", payload: data.total });
        } finally {
          setState({ type: "SET_IS_LOADING", payload: false });
        }
      })();
    }

    setState({ type: "SET_IS_MOUNTED", payload: true });
  }, [items, setState, state.isOpen]);

  if (!state.isMounted) {
    return null;
  }

  return (
    <Sheet
      open={state.isOpen}
      onOpenChange={(state) => {
        setState({ type: "SET_IS_OPEN", payload: state });
        setState({ type: "SET_IS_LOADING", payload: state });
      }}
    >
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          {itemCount > 0 && (
            <Badge
              variant="secondary"
              className="absolute -top-2 -right-2 size-6 justify-center rounded-full p-2.5"
            >
              {itemCount}
            </Badge>
          )}
          <ShoppingBagIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your Cart {`(${itemCount})`}</SheetTitle>
        </SheetHeader>
        {state.isLoading ? (
          <LoadingMessage />
        ) : state.cart.length === 0 ? (
          <EmptyCartMessage />
        ) : (
          <>
            <div className="mt-6 flex-grow space-y-6 overflow-y-auto px-4">
              {state.cart.map((item, i) => (
                <div key={i}>
                  <CartItem item={item} />
                  {state.cart.length !== i + 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
            </div>
            <div className="space-y-4 p-4">
              <div className="flex justify-between font-medium">
                <span>Subtotal</span>
                <span>{formatPrice(state.subtotal)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Discount</span>
                <span>{formatPrice(state.discount)}</span>
              </div>
              <div className="text-muted-foreground flex justify-between text-sm">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatPrice(state.total)}</span>
              </div>
            </div>
            <SheetFooter>
              <Button variant="outline" onClick={clearCart}>
                <Trash2Icon />
                Clear Cart
              </Button>
              <SheetClose asChild>
                <Link
                  href="/checkout"
                  className={cn(buttonVariants(), "w-full")}
                >
                  Go to Checkout
                </Link>
              </SheetClose>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function EmptyCartMessage() {
  return (
    <div className="flex h-[100vh] flex-col items-center justify-center space-y-4 py-12 text-center">
      <ShoppingBagIcon className="text-muted-foreground mb-2 h-12 w-12" />
      <h3 className="text-xl font-medium">Your cart is empty</h3>
      <p className="text-muted-foreground max-w-xs text-sm">
        Looks like you haven&apos;t added any items to your cart yet.
      </p>
      <Button className="mt-4" asChild>
        <Link href="/products">Browse Products</Link>
      </Button>
    </div>
  );
}

function LoadingMessage() {
  return (
    <div className="flex h-[100vh] items-center justify-center">
      <Loader2Icon className="text-muted-foreground size-12 animate-spin" />
    </div>
  );
}
