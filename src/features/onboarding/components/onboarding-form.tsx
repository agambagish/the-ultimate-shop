"use client";

import Link from "next/link";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  Loader2Icon,
  StoreIcon,
  UploadIcon,
  UserIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Stepper } from "@/components/global/stepper";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { businessTypeEnum, storeCategoryEnum } from "@/db/schema";
import { env } from "@/env";
import { createStore } from "@/features/onboarding/actions/create-store";
import type { OnboardingSchema } from "@/features/onboarding/lib/onboarding-schema";
import { onboardingSchema } from "@/features/onboarding/lib/onboarding-schema";
import type { Step } from "@/features/onboarding/lib/types";
import { useGetEmail } from "@/lib/utils";

const steps: Step[] = [
  {
    title: "Business Type",
    description: "Select your business type",
    fields: ["businessName", "businessType", "businessDescription"],
  },
  {
    title: "Personal Info",
    description: "Your contact details",
    fields: ["firstName", "lastName"],
  },
  {
    title: "Store Details",
    description: "Set up your store",
    fields: ["storeName", "storeUrl", "storeCategory", "storeDescription"],
  },
  {
    title: "Legal Info",
    description: "Business documents",
    fields: ["taxId", "address", "country", "state", "city", "zipCode"],
  },
  {
    title: "Review",
    description: "Review information",
    fields: [],
  },
];

export function OnboardingForm() {
  const [_, setPreviousStep] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const isFinalStep = currentStep === steps.length - 1;
  const email = useGetEmail();

  const form = useForm<OnboardingSchema>({
    mode: "onChange",
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      businessName: "",
      businessDescription: "",
      firstName: "",
      lastName: "",
      storeName: "",
      storeUrl: "",
      storeDescription: "",
      taxId: "",
      address: "",
      country: "",
      state: "",
      city: "",
      zipCode: "",
    },
  });

  async function onSubmit(payload: OnboardingSchema) {
    setIsLoading(true);
    const { data, error } = await createStore(payload);

    if (error) {
      toast.error(error);
      setIsLoading(false);
    }

    if (data) {
      toast.success("Application request received.");
      setIsLoading(false);
      setCurrentStep((s) => s + 1);
      setIsCompleted(true);
    }
  }

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

  return (
    <>
      <div className="mb-10">
        <Stepper steps={steps} activeStep={currentStep} className="w-full" />
      </div>
      <Card className="w-full">
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            {currentStep === 0 && (
              <>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                  <CardDescription>Tell us about your business</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your business name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="businessType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full capitalize">
                              <SelectValue placeholder="Select business type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {businessTypeEnum.enumValues.map((e) => (
                              <SelectItem
                                key={e}
                                value={e}
                                className="capitalize"
                              >
                                {e.replaceAll("_", " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="businessDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Briefly describe your business"
                            className="min-h-[100px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </>
            )}
            {currentStep === 1 && (
              <>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Provide your contact details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your first name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" readOnly defaultValue={email} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </CardContent>
              </>
            )}
            {currentStep === 2 && (
              <>
                <CardHeader>
                  <CardTitle>Store Details</CardTitle>
                  <CardDescription>Set up your online store</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="storeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your store name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="storeUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store URL</FormLabel>
                        <FormControl>
                          <div className="flex rounded-md">
                            <span className="border-input bg-background text-muted-foreground z-10 inline-flex w-[16rem] items-center rounded-s-md border px-3 text-sm">
                              {env.NEXT_PUBLIC_APP_URL}/
                            </span>
                            <Input
                              className="-ms-px rounded-s-none shadow-none"
                              placeholder="your-store-url"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="storeCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full capitalize">
                              <SelectValue placeholder="Select store category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {storeCategoryEnum.enumValues.map((e) => (
                              <SelectItem
                                key={e}
                                value={e}
                                className="capitalize"
                              >
                                {e.replaceAll("_", " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="storeDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe what your store offers"
                            className="min-h-[100px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </>
            )}
            {currentStep === 3 && (
              <>
                <CardHeader>
                  <CardTitle>Legal Information</CardTitle>
                  <CardDescription>
                    Provide your business&apos;s legal details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="taxId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax ID / GSTIN</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your tax identification number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Address</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Street address"
                            className="min-h-[100px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Your city" {...field} />
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
                          <FormLabel>State / Province</FormLabel>
                          <FormControl>
                            <Input placeholder="Your state" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="Your country" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip / Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Zip code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </>
            )}
            {currentStep === 4 && (
              <>
                <CardHeader>
                  <CardTitle>Application Complete</CardTitle>
                  <CardDescription>
                    Review your information before submitting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-muted rounded-lg p-4">
                      <h3 className="mb-2 flex items-center font-medium">
                        <StoreIcon className="mr-2 size-5" /> Business
                        Information
                      </h3>
                      <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                        <div>
                          <p className="text-muted-foreground">Business Name</p>
                          <p>{form.getValues("businessName")}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Business Type</p>
                          <p className="capitalize">
                            {form
                              .getValues("businessType")
                              .replaceAll("_", " ")}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <h3 className="mb-2 flex items-center font-medium">
                        <UserIcon className="mr-2 size-5" /> Personal
                        Information
                      </h3>
                      <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                        <div>
                          <p className="text-muted-foreground">Name</p>
                          <p>
                            {form.getValues("firstName")}{" "}
                            {form.getValues("lastName")}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Email</p>
                          <p>{email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <h3 className="mb-2 flex items-center font-medium">
                        <StoreIcon className="mr-2 size-5" /> Store Details
                      </h3>
                      <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                        <div>
                          <p className="text-muted-foreground">Store Name</p>
                          <p>{form.getValues("storeName")}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Store URL</p>
                          <p>
                            {env.NEXT_PUBLIC_APP_URL}/
                            {form.getValues("storeUrl")}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Category</p>
                          <p className="capitalize">
                            {form
                              .getValues("storeCategory")
                              .replaceAll("_", " ")}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <h3 className="mb-2 flex items-center font-medium">
                        <UploadIcon className="mr-2 size-5" /> Legal Information
                      </h3>
                      <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                        <div>
                          <p className="text-muted-foreground">Tax ID</p>
                          <p>{form.getValues("taxId")}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Address</p>
                          <p>
                            {form.getValues("address")},{" "}
                            {form.getValues("city")}, {form.getValues("state")}{" "}
                            {form.getValues("zipCode")},{" "}
                            {form.getValues("country")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </>
            )}
            {isCompleted && (
              <>
                <CardHeader>
                  <CardTitle>Application Complete</CardTitle>
                  <CardDescription>
                    Your seller application has been submitted successfully
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <div className="bg-primary/10 mb-6 rounded-full p-6">
                    <CheckIcon className="text-primary h-12 w-12" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Thank You!</h3>
                  <p className="text-muted-foreground max-w-md text-center">
                    Your application has been received and is being reviewed.
                    You will receive an email notification once your account is
                    approved.
                  </p>
                </CardContent>
                <CardFooter className="justify-center">
                  <Link href="/" className={buttonVariants()}>
                    Return to Homepage
                  </Link>
                </CardFooter>
              </>
            )}
            {!isCompleted && (
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onPrevious}
                  disabled={currentStep === 0 || isLoading}
                >
                  <ArrowLeftIcon className="size-4" /> Back
                </Button>
                <Button type="button" onClick={onNext} disabled={isLoading}>
                  {isFinalStep ? (
                    isLoading ? (
                      <>
                        <Loader2Icon className="size-4 animate-spin" /> Submit
                      </>
                    ) : (
                      <>
                        <CheckIcon className="size-4" /> Submit
                      </>
                    )
                  ) : (
                    <>
                      Next <ArrowRightIcon className="size-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            )}
          </form>
        </Form>
      </Card>
    </>
  );
}
