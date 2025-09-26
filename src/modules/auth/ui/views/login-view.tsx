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
import { useTRPC } from "@/trpc/client";

import type { LoginSchema } from "../../lib/schemas";
import { loginSchema } from "../../lib/schemas";

export function LoginView() {
  const router = useRouter();

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const login = useMutation(
    trpc.auth.login.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.auth.session.queryFilter());
        router.push("/");
      },
    }),
  );

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const form = useForm<LoginSchema>({
    mode: "onChange",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function handleSubmit(values: LoginSchema) {
    login.mutate(values);
  }

  function toggleVisibility() {
    return setIsPasswordVisible((state) => !state);
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <Card className="border-border/40 bg-white/80 shadow-xl backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="font-bold text-2xl">Log in</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
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
                          disabled={login.isPending}
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
                          disabled={login.isPending}
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
              <div className="flex justify-end">
                <Link
                  href="#"
                  className="text-primary text-sm transition-colors hover:text-primary/80"
                >
                  Forgot your password?
                </Link>
              </div>
              <Button
                type="submit"
                className="h-12 w-full"
                disabled={login.isPending || !form.formState.isValid}
              >
                Log in
                {login.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <ArrowRight />
                )}
              </Button>
            </form>
          </Form>
          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Don't have an account?{" "}
            </span>
            <Link
              href="/register"
              className="font-medium text-primary transition-colors hover:text-primary/80"
            >
              Register for free
            </Link>
          </div>
        </CardContent>
      </Card>
      <div className="text-center text-muted-foreground text-xs">
        <p>
          New to TUS? Create an account to access thousands of premium digital
          assets.
        </p>
      </div>
    </div>
  );
}
