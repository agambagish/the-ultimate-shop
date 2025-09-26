"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, AtSign, Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Progress } from "@/components/ui/progress";
import { useTRPC } from "@/trpc/client";

import type { RegisterSchema } from "../../lib/schemas";
import { registerSchema } from "../../lib/schemas";

export function RegisterView() {
  const router = useRouter();

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const register = useMutation(
    trpc.auth.register.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.auth.session.queryFilter());
        router.push("/");
      },
    }),
  );

  const [step, setStep] = useState<number>(1);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const form = useForm<RegisterSchema>({
    mode: "onChange",
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      subdomain: "",
    },
  });

  function handleSubmit(values: RegisterSchema) {
    register.mutate(values);
  }

  function toggleVisibility() {
    return setIsPasswordVisible((state) => !state);
  }

  const subdomain = form.watch("subdomain");
  const subdomainErrors = form.formState.errors.subdomain;

  const canProceedToStep2 = Boolean(subdomain && !subdomainErrors);

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-2">
        <div className="flex justify-between text-muted-foreground text-sm">
          <span>Step {step} of 2</span>
          <span>{step === 1 ? "Store Setup" : "Account Details"}</span>
        </div>
        <Progress value={step * 50} className="h-2" />
      </div>
      <Card className="border-border/40 bg-white/80 shadow-xl backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="font-bold text-2xl">
            {step === 1 ? "Create Your Store" : "Complete Your Account"}
          </CardTitle>
          <CardDescription>
            {step === 1
              ? "Choose your unique store subdomain to get started"
              : "Fill in your personal details to finish setup"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              {step === 1 ? (
                <div className="space-y-4">
                  <FormField
                    key="subdomain"
                    control={form.control}
                    name="subdomain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subdomain</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              className="peer h-12 pe-12"
                              placeholder="your-store"
                              maxLength={24}
                              spellCheck="false"
                              autoComplete="off"
                              autoFocus
                              disabled={register.isPending}
                              {...field}
                            />
                            <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground text-sm peer-disabled:opacity-50">
                              .localhost:3000
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    className="h-12 w-full"
                    disabled={!canProceedToStep2}
                  >
                    Continue
                    <ArrowRight />
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <FormField
                    key="email"
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                              <AtSign className="size-4" />
                            </div>
                            <Input
                              placeholder="mystore@gmail.com"
                              type="email"
                              className="peer h-12 ps-9"
                              disabled={register.isPending}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    key="password"
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              className="h-12 pe-9"
                              placeholder="Password"
                              type={isPasswordVisible ? "text" : "password"}
                              disabled={register.isPending}
                              {...field}
                            />
                            <button
                              className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                              type="button"
                              onClick={toggleVisibility}
                            >
                              {isPasswordVisible ? (
                                <EyeOff className="size-4" />
                              ) : (
                                <Eye className="size-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="space-y-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="h-12 w-full"
                      disabled={register.isPending}
                    >
                      Back to Store Setup
                    </Button>
                    <Button
                      type="submit"
                      className="h-12 w-full"
                      disabled={register.isPending || !form.formState.isValid}
                    >
                      Create Account
                      {register.isPending ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <ArrowRight />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Form>
          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Already have an account?{" "}
            </span>
            <Link
              href="/login"
              className="font-medium text-primary transition-colors hover:text-primary/80"
            >
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Help Text */}
      <div className="text-center text-muted-foreground text-xs">
        <p>
          Need help? Contact our support team for assistance with account setup.
        </p>
      </div>
    </div>
  );
}
