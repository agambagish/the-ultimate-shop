"use client";

import Link from "next/link";

import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Loader2Icon, StoreIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  storeId: number | null;
}

export function AuthButton({ storeId }: Props) {
  return (
    <>
      <div className="flex items-center">
        <ClerkLoading>
          <Loader2Icon className="text-muted-foreground size-5 animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>
          <SignedIn>
            <UserButton>
              <UserButton.MenuItems>
                {storeId && (
                  <UserButton.Link
                    label="Dashboard"
                    href={`/dashboard/${storeId}`}
                    labelIcon={<StoreIcon className="size-4" />}
                  />
                )}
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
          <SignedOut>
            <Link
              href="/sign-in"
              className={buttonVariants({
                size: "sm",
                variant: "secondary",
              })}
            >
              Sign In
            </Link>
          </SignedOut>
        </ClerkLoaded>
      </div>
      {!storeId && (
        <>
          <div className="hidden border-r md:inline" />
          <Link
            href="/onboarding"
            className={cn(buttonVariants({ size: "sm" }), "hidden md:flex")}
          >
            <StoreIcon />
            Sell
          </Link>
        </>
      )}
    </>
  );
}
