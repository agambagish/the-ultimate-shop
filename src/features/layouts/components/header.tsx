import Link from "next/link";

import { auth } from "@clerk/nextjs/server";

import { AuthButton } from "@/features/layouts/components/auth-button";
import { MainNav } from "@/features/layouts/components/main-nav";
import { MobileNav } from "@/features/layouts/components/mobile-nav";
import { getStore } from "@/features/layouts/queries";

export async function Header() {
  const { userId } = await auth();
  const { data: storeId } = await getStore(userId ?? "");

  return (
    <header className="bg-background sticky top-0 left-0 z-40 w-full border-b px-4 sm:px-0">
      <div className="relative container mx-auto flex min-h-20 flex-row items-center gap-4 lg:grid lg:grid-cols-3">
        <div className="hidden flex-row items-center justify-start gap-4 lg:flex">
          <MainNav />
        </div>
        <div className="flex lg:justify-center">
          <Link href="/">
            <p className="font-extrabold">Shop</p>
          </Link>
        </div>
        <div className="flex w-full justify-end gap-4">
          <AuthButton storeId={storeId} />
        </div>
        <div className="flex w-12 shrink items-end justify-end lg:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
