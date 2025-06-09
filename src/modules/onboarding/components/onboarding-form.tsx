"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowBigLeftDashIcon,
  ArrowBigRightDashIcon,
  CheckIcon,
  HouseIcon,
  Loader2Icon,
  StoreIcon,
  User2Icon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/stepper";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";

import { steps } from "../lib/constants";
import type { OnboardingSchema } from "../schemas/onboarding-schema";
import { onboardingSchema } from "../schemas/onboarding-schema";
import { createStore } from "../server/create-store";

export function OnboardingForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [_, setPreviousStep] = useState<number>(0);
  const isFinalStep = currentStep === steps.length - 1;

  const form = useForm<OnboardingSchema>({
    mode: "onChange",
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
    },
  });

  async function onSubmit(values: OnboardingSchema) {
    setIsLoading(true);

    const { data, error } = await createStore(values);

    if (error) {
      toast.error(error);
      setIsLoading(false);
      return;
    }

    if (data) {
      toast.success("The request has been registered");
    }

    setIsLoading(false);
    setCurrentStep((val) => (val += 1));
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
      <Stepper value={currentStep + 1}>
        {steps.map((step, i) => (
          <StepperItem
            key={i}
            {...step}
            className="relative flex-1 flex-col!"
            onClick={() => setCurrentStep(i)}
          >
            <StepperTrigger className="flex-col gap-3 rounded">
              <StepperIndicator />
              <div className="space-y-0.5 px-2">
                <StepperTitle>{step.title}</StepperTitle>
                <StepperDescription className="max-sm:hidden">
                  {step.description}
                </StepperDescription>
              </div>
            </StepperTrigger>
            {step.step < steps.length && (
              <StepperSeparator className="absolute inset-x-0 top-3 left-[calc(50%+0.75rem+0.125rem)] -order-1 m-0 -translate-y-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none" />
            )}
          </StepperItem>
        ))}
      </Stepper>
      <Card className="mt-12 w-full">
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            {currentStep < steps.length - 1 && (
              <CardHeader>
                <CardTitle>{steps[currentStep].title}</CardTitle>
                <CardDescription>
                  {steps[currentStep].description}
                </CardDescription>
              </CardHeader>
            )}
            {currentStep === 0 && (
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Lucide Shop" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam consequuntur mollitia repudiandae nulla harum unde?"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store URL</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="peer ps-[14.2rem]"
                            placeholder="lucide-shop"
                            {...field}
                          />
                          <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
                            https://the-ultimate-shop.vercel.app/
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            )}
            {currentStep === 1 && (
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="addressLine1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="10, Lalalajpath Rai Sarani, Elgin Rd"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="addressLine2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 2</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Sreepally, Bhowanipore"
                          className="resize-none"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex space-x-6">
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
                <div className="flex space-x-6">
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
                  <FormField
                    control={form.control}
                    name="pinCode"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Pin Code</FormLabel>
                        <FormControl>
                          <Input placeholder="700020" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            )}
            {currentStep === 2 && (
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="mb-2 flex items-center font-medium">
                      <StoreIcon className="mr-2 h-5 w-5" /> {steps[0].title}
                    </h3>
                    <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                      <div>
                        <p className="text-muted-foreground">Store Name</p>
                        <p>{form.getValues("name")}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          Store Description
                        </p>
                        <p>{form.getValues("description")}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Store URL</p>
                      <p>
                        https://the-ultimate-shop.vercel.app/
                        {form.getValues("slug")}
                      </p>
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="mb-2 flex items-center font-medium">
                      <HouseIcon className="mr-2 h-5 w-5" /> {steps[1].title}
                    </h3>
                    <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                      <div>
                        <p className="text-muted-foreground">Address Line 1</p>
                        <p>{form.getValues("addressLine1")}</p>
                      </div>
                      {(form.getValues("addressLine2") as string).length >
                        0 && (
                        <div>
                          <p className="text-muted-foreground">
                            Address Line 2
                          </p>
                          <p>{form.getValues("addressLine2")}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-muted-foreground">City</p>
                        <p>{form.getValues("city")}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">State</p>
                        <p>{form.getValues("state")}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Country</p>
                        <p>{form.getValues("country")}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Pin Code</p>
                        <p>{form.getValues("pinCode")}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="mb-2 flex items-center font-medium">
                      <User2Icon className="mr-2 h-5 w-5" /> Owner&apos;s Info
                    </h3>
                    <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                      <div>
                        <p className="text-muted-foreground">Full Name</p>
                        <p>John Doe</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Email</p>
                        <p>johndoe@gmail.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
            {currentStep === 3 && (
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="bg-primary/10 mb-6 rounded-full p-6">
                  <CheckIcon className="text-primary h-12 w-12" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Thank You!</h3>
                <p className="text-muted-foreground max-w-md text-center">
                  Your application has been received and is being reviewed. You
                  will receive an email notification once your account is
                  approved.
                </p>
              </CardContent>
            )}
            {currentStep < steps.length && (
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onPrevious}
                  disabled={currentStep === 0 || isLoading}
                >
                  <ArrowBigLeftDashIcon /> Back
                </Button>
                <Button onClick={onNext} type="button" disabled={isLoading}>
                  {isFinalStep ? (
                    <>
                      {isLoading ? (
                        <Loader2Icon className="animate-spin" />
                      ) : (
                        <CheckIcon />
                      )}{" "}
                      Submit
                    </>
                  ) : (
                    <>
                      Next <ArrowBigRightDashIcon />
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
