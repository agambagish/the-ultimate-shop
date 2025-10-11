import Link from "next/link";
import { redirect } from "next/navigation";

import { ArrowBigLeftDash } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { caller } from "@/trpc/server";

export const dynamic = "force-dynamic";

export default async function ({ children }: React.PropsWithChildren) {
  const session = await caller.auth.session();

  if (!session.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <nav className="h-20 border-b bg-white font-medium">
        <div className="mx-auto flex h-full items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className={buttonVariants({ variant: "ghost" })}>
            <ArrowBigLeftDash />
            Continue Shopping
          </Link>
        </div>
      </nav>
      <div className="flex-1">{children}</div>
    </div>
  );
}
