"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";

interface Props {
  slug: string;
}

export function AddToCartButton({ slug }: Props) {
  const { addItem } = useCart();

  return (
    <>
      <Button
        size="lg"
        className="w-full cursor-pointer sm:w-1/2"
        onClick={() => addItem(slug)}
      >
        Add to Cart
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="w-full cursor-pointer sm:w-1/2"
      >
        Buy Now
      </Button>
    </>
  );
}
