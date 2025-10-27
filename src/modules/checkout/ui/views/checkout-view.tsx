"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { File, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, generateStoreURL } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

import { useCart } from "../../hooks/use-cart";
import { useCheckoutStates } from "../../hooks/use-checkout-states";
import { CheckoutItem } from "../components/checkout-item";
import { CheckoutSidebar } from "../components/checkout-sidebar";

interface Props {
  storeSubdomain: string;
}

export function CheckoutView({ storeSubdomain }: Props) {
  const router = useRouter();
  const [states, setStates] = useCheckoutStates();
  const { productIds, totalItems, removeProduct, clearCart } =
    useCart(storeSubdomain);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery(
    trpc.checkout.getProducts.queryOptions({
      productIds,
      storeSubdomain,
    }),
  );

  const purchase = useMutation(
    trpc.checkout.purchase.mutationOptions({
      onMutate: () => {
        setStates({ success: false, cancel: false });
      },
      onSuccess: (data) => {
        window.location.href = data.url;
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          // TODO: Modify when subdomains enabled
          router.push("/login");
        }

        toast.error(error.message);
      },
    }),
  );

  useEffect(() => {
    if (states.success) {
      setStates({ success: false, cancel: false });
      clearCart();
      queryClient.invalidateQueries(trpc.library.getMany.infiniteQueryFilter());
      window.location.href = "/library?success=true";
    }
  }, [states.success, clearCart, setStates, queryClient, trpc.library.getMany]);

  useEffect(() => {
    if (error?.data?.code === "NOT_FOUND") {
      clearCart();
      toast.warning("Invalid products found, cart cleared");
    }
  }, [error, clearCart]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="flex items-center border-border/40 bg-background/70 shadow-lg backdrop-blur-sm">
          <Loader2 className="animate-spin text-muted-foreground" />
          <p className="font-medium text-base text-muted-foreground">
            Just a moment...
          </p>
        </Card>
      </div>
    );
  }

  if (data?.products.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="flex items-center border-border/40 bg-background/70 shadow-lg backdrop-blur-sm">
          <File className="text-muted-foreground" />
          <p className="font-medium text-base text-muted-foreground">
            No products found
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Card className="border-border/40 bg-background/70 shadow-lg backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="font-bold tracking-tight">
                  Your Cart ({totalItems} items)
                </span>
                {(data?.totalSavings || 0) > 0 && (
                  <Badge
                    variant="outline"
                    className="h-8 border-green-200 bg-green-50 font-semibold text-green-600 text-sm"
                  >
                    You saved {formatCurrency(data?.totalSavings || 0)}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data?.products.map((product, index) => (
                <CheckoutItem
                  key={product.id}
                  isLast={index === data.products.length - 1}
                  imageUrl={
                    product.image_id
                      ? `/api/images/${product.image_id}`
                      : "/placeholder.png"
                  }
                  title={product.title}
                  productUrl={`${generateStoreURL(product.stores!.subdomain)}/products/${product.id}`}
                  storeUrl={generateStoreURL(product.stores!.subdomain)}
                  storeName={product.stores!.name}
                  price={product.price}
                  discountType={product.discount_type}
                  discountValue={product.discount_value}
                  onRemove={() => removeProduct(product.id.toString())}
                  disabled={false}
                />
              ))}
            </CardContent>
          </Card>
        </div>
        <CheckoutSidebar
          subtotal={data?.subtotal || 0}
          totalSavings={data?.totalSavings || 0}
          total={data?.total || 0}
          totalItems={totalItems}
          onCardCheckout={() => {}}
          onUPICheckout={({ vpa }) =>
            purchase.mutate({
              productIds,
              storeSubdomain,
              credentials: {
                type: "upi",
                vpa,
              },
            })
          }
          isCancelled={states.cancel}
          disabled={purchase.isPending}
        />
      </div>
    </div>
  );
}
