"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2, Mail } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
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

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const form = useForm<RegisterSchema>({
    mode: "onChange",
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
    },
  });

  function handleSubmit(values: RegisterSchema) {
    register.mutate(values);
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
                Create Your Account
              </CardTitle>
              <CardDescription>
                Fill in your personal details to create account
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
                    name="fullname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            disabled={register.isPending}
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
                          <InputGroup>
                            <InputGroupInput
                              placeholder="johndoe@gmail.com"
                              type="email"
                              disabled={register.isPending}
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
                              disabled={register.isPending}
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={register.isPending || !form.formState.isValid}
                  >
                    {register.isPending && <Loader2 className="animate-spin" />}
                    Create Account
                  </Button>
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
                  Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
