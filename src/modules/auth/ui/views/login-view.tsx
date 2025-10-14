"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Fingerprint, Loader2, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Logo } from "@/components/logo";
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
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
    <div className="flex h-screen flex-col">
      <div className="px-6 py-4">
        <Logo className="w-64" />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md">
          <Card className="border-border/40 bg-white/80 shadow-xl backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="font-bold text-2xl tracking-tight">
                Login
              </CardTitle>
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
                          <InputGroup>
                            <InputGroupInput
                              placeholder="johndoe@gmail.com"
                              type="email"
                              disabled={login.isPending}
                              {...field}
                            />
                            <InputGroupAddon>
                              <Mail />
                            </InputGroupAddon>
                          </InputGroup>
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
                          <InputGroup>
                            <InputGroupInput
                              placeholder="Password"
                              type={isPasswordVisible ? "text" : "password"}
                              disabled={login.isPending}
                              {...field}
                            />
                            <InputGroupAddon
                              align="inline-end"
                              onClick={toggleVisibility}
                              className="cursor-pointer"
                            >
                              {isPasswordVisible ? <EyeOff /> : <Eye />}
                            </InputGroupAddon>
                          </InputGroup>
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
                    className="w-full"
                    size="lg"
                    disabled={login.isPending || !form.formState.isValid}
                  >
                    {login.isPending ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Fingerprint />
                    )}
                    Login
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
        </div>
      </div>
    </div>
  );
}
