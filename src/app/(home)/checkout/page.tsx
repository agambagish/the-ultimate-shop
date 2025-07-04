"use client";

import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Product } from "@/db/schema";
import { env } from "@/env";
import { useCart } from "@/hooks/use-cart";
import { CheckoutSummary } from "@/modules/checkout/components/checkout-summary";
import { usePayment } from "@/modules/checkout/hooks/use-payment";
import type { BillingAddressSchema } from "@/modules/checkout/schemas/billing-address-schema";
import { billingAddressSchema } from "@/modules/checkout/schemas/billing-address-schema";
import type { HashParamSchema } from "@/modules/checkout/schemas/hash-param-schema";
import { createOrder } from "@/modules/checkout/server/create-order";
import { generateHash } from "@/modules/checkout/server/generate-hash";

type CartItem = Pick<
  Product,
  "title" | "slug" | "price" | "discountPercentage" | "thumbnailImageURL"
> & {
  category: string;
  storeId: number;
};

export default function Page() {
  const { items } = useCart();
  const { isLoading: paymentLoading, redirectToPayment } = usePayment();

  const [isOrderSummaryLoading, setIsOrderSummaryLoading] =
    useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [subtotal, setSubtotal] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const disabled = isLoading || paymentLoading;

  useEffect(() => {
    (async () => {
      setIsOrderSummaryLoading(true);

      try {
        const res = await fetch(`${env.NEXT_PUBLIC_APP_URL}/api/cart`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(items),
        });

        const data = await res.json();
        setCart(data.cart);
        setSubtotal(data.subtotal);
        setDiscount(data.discount);
        setTotal(data.total);
      } finally {
        setIsOrderSummaryLoading(false);
      }
    })();
  }, [items]);

  const form = useForm<BillingAddressSchema>({
    resolver: zodResolver(billingAddressSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      address: "",
      city: "",
      state: "",
      pinCode: "",
      country: "",
    },
  });

  function onSubmit(values: BillingAddressSchema) {
    setIsLoading(true);
    const transactionId = crypto.randomUUID();

    toast.promise(
      createOrder({
        billingAddress: values,
        cart,
        transactionId,
        totalAmount: Math.round(total).toString(),
      }).then(async (orderId) => {
        const payload: HashParamSchema = {
          ...values,
          key: env.NEXT_PUBLIC_PAYU_KEY,
          txnid: transactionId,
          productinfo: orderId.toString(),
          amount: Math.round(total),
          surl: `${env.NEXT_PUBLIC_APP_URL}/checkout/success`,
          furl: `${env.NEXT_PUBLIC_APP_URL}/checkout/failed`,
          phone: 9876543210,
        };

        const hash = await generateHash(payload);
        redirectToPayment({ ...payload, hash });
      }),
      {
        loading: "Processing order...",
        error: ({ message }: { message: string }) => {
          return message;
        },
      }
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:py-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Billing Details</h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John"
                            disabled={disabled}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Doe"
                            disabled={disabled}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="johndoe@gmail.com"
                            type="email"
                            disabled={disabled}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123 Main St"
                          disabled={disabled}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Kolkata"
                            disabled={disabled}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="West Bengal"
                            disabled={disabled}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pinCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pin Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="700020"
                            disabled={disabled}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="India"
                          disabled={disabled}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={disabled}>
                    {disabled && <Loader2Icon className="animate-spin" />}
                    Continue to Payment
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
        <div className="lg:col-span-1">
          <CheckoutSummary
            cart={cart}
            discount={discount}
            isLoading={isOrderSummaryLoading}
            subtotal={subtotal}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}
