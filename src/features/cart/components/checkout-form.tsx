"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Loader2Icon,
  ScanSearchIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";

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
import { generateCheckoutHash } from "@/features/cart/actions";
import type { CheckoutSchema } from "@/features/cart/lib/checkout-schema";
import { checkoutSchema } from "@/features/cart/lib/checkout-schema";
import type { Step } from "@/features/cart/lib/types";
import { pgEncoder } from "@/lib/utils";

const steps: Step[] = [
  {
    title: "Address",
    description: "Enter address",
    fields: ["address1", "address2", "city", "state", "zipcode", "country"],
  },
  {
    title: "Payment",
    description: "Enter your UPI ID",
    fields: ["vpa"],
  },
  {
    title: "Review Info",
    description: "Check your address & UPI ID",
    fields: ["vpa"],
  },
];

interface Props {
  cart: string;
  amount: number;
  firstname: string;
  lastname: string;
  email: string;
  userId: string;
}

export function CheckoutForm({
  cart,
  amount,
  firstname,
  lastname,
  email,
  userId,
}: Props) {
  const [_previousStep, setPreviousStep] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isLoading, _setIsLoading] = useState<boolean>(false);
  const [isCompleted, _setIsCompleted] = useState<boolean>(false);
  const isFinalStep = currentStep === steps.length - 1;

  const txnid = crypto.randomUUID();

  const form = useForm<CheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
    defaultValues: {
      key: env.NEXT_PUBLIC_PAYU_KEY,
      txnid,
      amount,
      productinfo: "The Ultimate Shop Checkout",
      firstname,
      lastname,
      surl: `${env.NEXT_PUBLIC_NODE_ENV === "development" ? env.NEXT_PUBLIC_NGROK_URL : `https://${env.NEXT_PUBLIC_APP_URL}`}/orders/${txnid}`,
      furl: `${env.NEXT_PUBLIC_NGROK_URL}/orders/failed`,
      email,
      pg: "UPI",
      bankcode: "UPI",
      vpa: "",
      phone: 919999999999,
      hash: "",
      udf1: cart,
      udf2: userId,
      udf3: "",
      udf4: "",
      udf5: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
    },
  });

  async function onNext() {
    const fields = steps[currentStep].fields;
    const output = await form.trigger(fields, { shouldFocus: true });

    if (!output) return;

    if (currentStep < steps.length) {
      if (isFinalStep) {
        await form.handleSubmit(onSubmit)();
        return;
      }
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  }

  function onPrevious() {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  }

  async function onHashGenerate() {
    const {
      key,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
    } = form.getValues();

    const { hash } = await generateCheckoutHash({
      key,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
    });

    form.setValue("hash", hash);
    onNext();
  }

  // async function onVerifyVpa() {
  //   setIsLoading(true);

  //   const { vpa } = form.getValues();

  //   const { valid } = await verifyVpa(vpa);

  //   if (!valid) {
  //     form.setError("vpa", { message: "Enter a valid vpa" });
  //     setIsLoading(false);
  //     return;
  //   }

  //   onNext();
  //   setIsLoading(false);
  // }

  function onSubmit() {}

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        action="https://test.payu.in/_payment"
        method="post"
      >
        {currentStep === 0 && (
          <>
            <div className="flex space-x-4 lg:flex-col lg:space-y-6 lg:space-x-0">
              <FormField
                control={form.control}
                name="address1"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl>
                      <Input placeholder="15 Park Street" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address2"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Address Line 2</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Mullick Bazar, Beniapukur"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Kolkata" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="West Bengal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="zipcode"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Pin Code</FormLabel>
                    <FormControl>
                      <Input placeholder="700016" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="India" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        )}
        {currentStep === 1 && (
          <FormField
            control={form.control}
            name="vpa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UPI ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="anything@payu"
                    autoComplete="off"
                    spellCheck="false"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-muted rounded-lg p-4">
              <h3 className="mb-2 flex items-center font-medium">
                <ScanSearchIcon className="mr-2 size-5" /> Review Info
              </h3>
              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2 lg:grid-cols-1">
                <div>
                  <p className="text-muted-foreground">UPI ID</p>
                  <p>{form.getValues("vpa")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Delivery Address</p>
                  <p>
                    {form.getValues("address1")}, {form.getValues("address2")},{" "}
                    {form.getValues("city")}, {form.getValues("state")}{" "}
                    {form.getValues("zipcode")}, {form.getValues("country")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {isFinalStep && (
          <>
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <FormField
              control={form.control}
              name="txnid"
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <FormField
              control={form.control}
              name="productinfo"
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <FormField
              control={form.control}
              name="surl"
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <FormField
              control={form.control}
              name="furl"
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <FormField
              control={form.control}
              name="pg"
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <FormField
              control={form.control}
              name="bankcode"
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <FormField
              control={form.control}
              name="vpa"
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <FormField
              control={form.control}
              name="hash"
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <FormField
              control={form.control}
              name="address1"
              render={({ field }) => (
                <input
                  type="hidden"
                  {...field}
                  value={pgEncoder(field.value)}
                />
              )}
            />
            <FormField
              control={form.control}
              name="address2"
              render={({ field }) => (
                <input
                  type="hidden"
                  {...field}
                  value={pgEncoder(field.value)}
                />
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <input
                  type="hidden"
                  {...field}
                  value={pgEncoder(field.value)}
                />
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <input
                  type="hidden"
                  {...field}
                  value={pgEncoder(field.value)}
                />
              )}
            />
            <FormField
              control={form.control}
              name="zipcode"
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <input
                  type="hidden"
                  {...field}
                  value={pgEncoder(field.value)}
                />
              )}
            />
            <FormField
              control={form.control}
              name="udf1"
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <FormField
              control={form.control}
              name="udf2"
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <FormField
              control={form.control}
              name="udf3"
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <FormField
              control={form.control}
              name="udf4"
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <FormField
              control={form.control}
              name="udf5"
              render={({ field }) => <input type="hidden" {...field} />}
            />
          </>
        )}
        {!isCompleted && (
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onPrevious}
              disabled={currentStep === 0 || isLoading}
            >
              <ArrowLeftIcon className="size-4" /> Back
            </Button>
            {!isFinalStep ? (
              <Button
                type="button"
                onClick={currentStep === 1 ? onHashGenerate : onNext}
                disabled={isLoading}
              >
                Next
                {isLoading ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <ArrowRightIcon className="size-4" />
                )}
              </Button>
            ) : (
              <Button type="submit" variant="secondary">
                {isLoading && <Loader2Icon className="animate-spin" />}
                <UPIIcon /> Checkout
              </Button>
            )}
          </div>
        )}
      </form>
    </Form>
  );
}

function UPIIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={100}
      height={100}
      viewBox="0 0 48 48"
    >
      <g transform="matrix(.35278 0 0 -.35278 30.588 .01)">
        <linearGradient
          id="fZ5QJO0zpePOIUpGT06DDa_1AzdGyrT9jI0_gr1"
          x1="-67.013"
          x2="-35.864"
          y1="-20.175"
          y2="-52.601"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0} stopColor="#21ad64" />
          <stop offset={1} stopColor="#088242" />
        </linearGradient>
        <path
          fill="url(#fZ5QJO0zpePOIUpGT06DDa_1AzdGyrT9jI0_gr1)"
          d="M-3.488-12.991l26.973-53.638c0.605-1.203,0.349-2.66-0.629-3.586 l-56.7-53.632c-2.244-2.123-5.86,0.053-5.035,3.03L-9.152-13.546C-8.407-10.858-4.742-10.498-3.488-12.991z"
        />
      </g>
      <path
        d="M25.729,10.67l-7.631,27.536l13.43-12.698c0.661-0.625,0.837-1.629,0.429-2.44L25.729,10.67z"
        opacity=".05"
      />
      <path
        d="M25.53,11.388l-7.173,25.885l12.828-12.129c0.502-0.475,0.636-1.236,0.326-1.853L25.53,11.388z"
        opacity=".07"
      />
      <linearGradient
        id="fZ5QJO0zpePOIUpGT06DDb_1AzdGyrT9jI0_gr2"
        x1="-3.965"
        x2="30.418"
        y1="4.688"
        y2="39.071"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0} stopColor="#fed100" />
        <stop offset={1} stopColor="#e36001" />
      </linearGradient>
      <path
        fill="url(#fZ5QJO0zpePOIUpGT06DDb_1AzdGyrT9jI0_gr2)"
        d="M21.557,4.593l9.507,18.922c0.213,0.424,0.123,0.938-0.222,1.265L10.831,43.7	c-0.792,0.749-2.067-0.019-1.776-1.07L19.559,4.788C19.822,3.84,21.115,3.714,21.557,4.593z"
      />
    </svg>
  );
}
