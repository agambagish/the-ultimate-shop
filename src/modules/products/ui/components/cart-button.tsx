import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/modules/checkout/hooks/use-cart";

interface Props {
  storeSubdomain: string;
  productId: string;
  isPurchased?: boolean;
}

export function CartButton({ storeSubdomain, productId, isPurchased }: Props) {
  const cart = useCart(storeSubdomain);

  if (isPurchased) {
    return (
      <Link
        href={`/library/${productId}`}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-14 w-full cursor-pointer font-semibold text-lg shadow-lg",
        )}
      >
        View in Library
      </Link>
    );
  }

  return (
    <Button
      className="h-14 w-full cursor-pointer font-semibold text-lg shadow-lg"
      onClick={() => cart.toggleProduct(productId)}
      variant={cart.isProductInCart(productId) ? "outline" : "default"}
    >
      {cart.isProductInCart(productId) ? "Remove from cart" : "Add to cart"}
    </Button>
  );
}
