import { Button } from "@/components/ui/button";
import { useCart } from "@/modules/checkout/hooks/use-cart";

interface Props {
  storeSubdomain: string;
  productId: string;
}

export function CartButton({ storeSubdomain, productId }: Props) {
  const cart = useCart(storeSubdomain);

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
