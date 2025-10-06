"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

import { useSuspenseQuery } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
import { generateStoreURL } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

const CheckoutButton = dynamic(
  () =>
    import("@/modules/checkout/ui/components/checkout-button").then(
      (mod) => mod.CheckoutButton,
    ),
  {
    ssr: false,
    loading: () => <Skeleton className="size-9" />,
  },
);

interface Props {
  subdomain: string;
}

export function Navbar({ subdomain }: Props) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.stores.getOne.queryOptions({
      subdomain,
    }),
  );

  return (
    <nav className="h-20 border-b bg-white font-medium">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href={generateStoreURL(subdomain)}
          className="flex items-center gap-2"
        >
          {data.avatar?.url && (
            <Image
              src={data.avatar.url}
              width={32}
              height={32}
              className="size-[32px] shrink-0 rounded-full border"
              alt={subdomain}
            />
          )}
          <p className="font-bold text-xl">{data.name}</p>
        </Link>
        <CheckoutButton storeSubdomain={subdomain} hideIfEmpty />
      </div>
    </nav>
  );
}

export function NavbarSkeleton() {
  return (
    <nav className="h-20 border-b bg-white font-medium">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-[32px] w-20" />
      </div>
    </nav>
  );
}
