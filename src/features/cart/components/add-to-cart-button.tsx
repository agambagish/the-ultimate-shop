"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/hooks/use-cart";

interface Props {
  productId: number;
}

export function AddToCartButton({ productId }: Props) {
  const { addItem } = useCart();

  return (
    <Button
      type="button"
      onClick={() => addItem({ productId, qty: 1 })}
      className="w-full"
      size="lg"
    >
      Add to Cart
    </Button>
  );
}
