import Link from "next/link";

import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="flex justify-between border-t p-6">
      <Logo className="w-56" />
      <div className="flex space-x-2">
        <Link href="#" className={buttonVariants({ variant: "link" })}>
          Privacy
        </Link>
        <Link href="#" className={buttonVariants({ variant: "link" })}>
          Terms
        </Link>
      </div>
    </footer>
  );
}
