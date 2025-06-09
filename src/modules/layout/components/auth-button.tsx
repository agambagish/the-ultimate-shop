import Link from "next/link";

import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Loader2Icon } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";

export function AuthButton() {
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
            <UserButton />
          </Button>
        </SignedIn>
      </ClerkLoaded>
    </>
  );
}
