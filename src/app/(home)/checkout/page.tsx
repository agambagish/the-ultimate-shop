"use client";

import { useEffect } from "react";

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
import { env } from "@/env";
import { useCart } from "@/hooks/use-cart";
import { CheckoutSummary } from "@/modules/checkout/components/checkout-summary";
import { useCheckoutStates } from "@/modules/checkout/hooks/use-checkout-states";
import { usePayment } from "@/modules/checkout/hooks/use-payment";
import type { BillingAddressSchema } from "@/modules/checkout/schemas/billing-address-schema";
import { billingAddressSchema } from "@/modules/checkout/schemas/billing-address-schema";
import type { HashParamSchema } from "@/modules/checkout/schemas/hash-param-schema";
import { createOrder } from "@/modules/checkout/server/create-order";
import { generateHash } from "@/modules/checkout/server/generate-hash";
import { getCart } from "@/modules/layout/server/get-cart";

export default function Page() {
  const { items } = useCart();
  const { isLoading: paymentLoading, redirectToPayment } = usePayment();
  const { state, setState } = useCheckoutStates();

  const disabled = state.isLoading || paymentLoading;

  useEffect(() => {
    (async () => {
      setState({ type: "SET_ORDER_SUMMARY_LOADING", payload: true });

      try {
        const data = await getCart(items);
        setState({ type: "SET_CART", payload: data.cart });
        setState({ type: "SET_SUBTOTAL", payload: data.subtotal });
        setState({ type: "SET_DISCOUNT", payload: data.discount });
        setState({ type: "SET_TOTAL", payload: data.total });
      } finally {
        setState({ type: "SET_ORDER_SUMMARY_LOADING", payload: false });
      }
    })();
  }, [items, setState]);

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
    setState({ type: "SET_LOADING", payload: true });
    const transactionId = crypto.randomUUID();

    toast.promise(
      createOrder({
        billingAddress: values,
        cart: state.cart,
        transactionId,
        subtotal: Math.round(state.subtotal).toString(),
        total: Math.round(state.total).toString(),
        discount: Math.round(state.discount).toString(),
      }).then(async (orderId) => {
        const payload: HashParamSchema = {
          ...values,
          key: env.NEXT_PUBLIC_PAYU_KEY,
          txnid: transactionId,
          productinfo: orderId.toString(),
          amount: Math.round(state.total),
          surl: `${env.NEXT_PUBLIC_APP_URL}/orders/${transactionId}`,
          furl: `${env.NEXT_PUBLIC_APP_URL}/orders/failed`,
          phone: 9876543210,
        };

        const hash = await generateHash(payload);
        redirectToPayment({ ...payload, hash });
      }),
      {
        loading: "Processing order...",
        error: ({ message }: { message: string }) => {
          setState({ type: "SET_LOADING", payload: false });
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
            cart={state.cart}
            discount={state.discount}
            isLoading={state.isOrderSummaryLoading}
            subtotal={state.subtotal}
            total={state.total}
          />
        </div>
      </div>
    </div>
  );
}
