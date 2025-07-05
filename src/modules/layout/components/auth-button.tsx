"use client";

import Link from "next/link";

import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { LayoutDashboardIcon, Loader2Icon, PackageIcon } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";

interface Props {
  storeSlug?: string;
}

export function AuthButton({ storeSlug }: Props) {
  return (
    <>
      <ClerkLoading>
        <Button size="icon" variant="secondary">
          <Loader2Icon className="animate-spin" />
        </Button>
      </ClerkLoading>
      <ClerkLoaded>
        <SignedOut>
          <Link
            href="/sign-in"
            className={buttonVariants({ variant: "secondary" })}
          >
            Log in
          </Link>
        </SignedOut>
        <SignedIn>
          <Button size="icon" variant="secondary">
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Link
                  label="Orders"
                  href="/orders"
                  labelIcon={<PackageIcon className="size-4" />}
                />
              </UserButton.MenuItems>
              <UserButton.MenuItems>
                {!!storeSlug && (
                  <UserButton.Link
                    label="Dashboard"
                    href={`/dashboard/${storeSlug}`}
                    labelIcon={<LayoutDashboardIcon className="size-4" />}
                  />
                )}
              </UserButton.MenuItems>
            </UserButton>
          </Button>
        </SignedIn>
      </ClerkLoaded>
    </>
  );
}
