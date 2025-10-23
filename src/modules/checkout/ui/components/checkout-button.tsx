import Link from "next/link";

import { ShoppingBag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn, generateStoreURL } from "@/lib/utils";

import { useCart } from "../../hooks/use-cart";

interface Props {
  hideIfEmpty?: boolean;
  storeSubdomain: string;
}

export function CheckoutButton({ storeSubdomain, hideIfEmpty }: Props) {
  const { totalItems } = useCart(storeSubdomain);

  if (hideIfEmpty && totalItems === 0) return null;

  return (
    <Link
      href={`${generateStoreURL(storeSubdomain)}/checkout`}
      className={cn(
        buttonVariants({ variant: "outline", size: "icon" }),
        "themed-outline-btn relative",
      )}
    >
      <ShoppingBag />
      {totalItems > 0 && (
        <Badge
          variant="secondary"
          className="-right-2 -top-2 absolute size-6 justify-center rounded-full p-2.5"
        >
          {totalItems}
        </Badge>
      )}
    </Link>
  );
}
