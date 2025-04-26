"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import { useClerk } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckoutForm } from "@/features/cart/components/checkout-form";
import { useCart } from "@/features/cart/hooks/use-cart";
import { getCart } from "@/features/cart/queries";
import { calculatePrices, formatPrice, useGetEmail } from "@/lib/utils";

export default function Page() {
  const { items } = useCart();
  const { user } = useClerk();
  const email = useGetEmail();

  const {
    mutate: mutateCart,
    data: cart,
    isPending,
  } = useMutation({
    mutationFn: getCart,
  });

  useEffect(() => {
    mutateCart(items);
  }, [items, mutateCart]);

  const { total, subtotal, discount, discountPercentage } =
    calculatePrices(cart);

  return (
    <main className="pb-20">
      <div className="mx-auto max-w-7xl px-4 xl:px-0">
        <Breadcrumb className="my-6 pl-1">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Checkout</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h2 className="mb-5 text-3xl font-bold md:mb-6 md:text-[40px]">
          Checkout
        </h2>
        <div className="flex flex-col items-start space-y-5 lg:flex-row lg:space-y-0 lg:space-x-5">
          <Card className="w-full">
            <CardContent className="space-y-4">
              {isPending
                ? [...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-3">
                      <div className="xs:flex-row flex flex-col items-start justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <Skeleton className="relative aspect-square size-16 min-w-fit rounded" />
                          <div className="flex flex-col space-y-1 self-start">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-40" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                        <div className="xs:w-auto xs:justify-normal flex w-full items-center justify-between space-x-2">
                          <div className="flex items-center space-x-0.5">
                            <Skeleton className="size-8 rounded-r-none" />
                            <Skeleton className="h-8 w-14 rounded-none" />
                            <Skeleton className="size-8 rounded-l-none" />
                          </div>
                          <Skeleton className="size-8" />
                        </div>
                      </div>
                    </div>
                  ))
                : cart?.map((item) => (
                    <div className="space-y-3" key={item.id}>
                      <div className="flex items-start justify-between gap-4">
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
                              Qty {item.qty}
                            </span>
                            <span className="text-muted-foreground line-clamp-1 text-xs capitalize">
                              {item.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-1 font-medium">
                          <div>
                            <span className="ml-auto line-clamp-1 text-sm">
                              {formatPrice(
                                (
                                  (Number(item.discountedPrice) > 0
                                    ? Number(item.discountedPrice)
                                    : Number(item.price)) * item.qty
                                ).toFixed(2)
                              )}
                            </span>
                          </div>
                          <span className="text-muted-foreground line-clamp-1 text-xs">
                            {formatPrice(
                              Number(item.discountedPrice) > 0
                                ? Number(item.discountedPrice)
                                : Number(item.price)
                            )}{" "}
                            each
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
            </CardContent>
          </Card>
          <Card className="w-full lg:w-[42rem]">
            <CardContent className="space-y-4">
              <h6 className="text-xl font-bold md:text-2xl">Order Summary</h6>
              {isPending ? (
                <>
                  <div className="flex flex-col space-y-5">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-12" />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-7 w-16" />
                      <Skeleton className="h-7 w-24" />
                    </div>
                  </div>
                  <div className="mt-10 space-y-6">
                    <div className="flex space-x-4 lg:flex-col lg:space-y-6 lg:space-x-0">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex space-x-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex space-x-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex justify-end">
                      <Skeleton className="h-10 w-32" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground md:text-xl">
                        Subtotal
                      </span>
                      <span className="font-bold md:text-xl">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground md:text-xl">
                        Discount {`(${discountPercentage}%)`}
                      </span>
                      <span className="text-destructive font-bold md:text-xl">
                        {formatPrice(discount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground md:text-xl">
                        Shipping
                      </span>
                      <span className="font-bold md:text-xl">Free</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-black md:text-xl">Total</span>
                      <span className="text-xl font-bold md:text-2xl">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                  <CheckoutForm
                    cart={JSON.stringify(
                      cart?.map(({ id, qty }) => ({ id, qty }))
                    )}
                    amount={Math.round(total)}
                    firstname={user?.firstName ?? ""}
                    lastname={user?.lastName ?? ""}
                    userId={user?.id ?? ""}
                    email={email}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
