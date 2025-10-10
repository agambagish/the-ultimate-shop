import Link from "next/link";

import { ArrowBigLeftDash } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

export default function ({ children }: React.PropsWithChildren) {
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
