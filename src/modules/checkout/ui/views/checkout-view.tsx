"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  File,
  HeadphonesIcon,
  Loader2,
  RotateCcw,
  Shield,
  Truck,
} from "lucide-react";
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
      router.push("/library");
    }
  }, [
    states.success,
    clearCart,
    setStates,
    queryClient,
    trpc.library.getMany,
    router.push,
  ]);

  useEffect(() => {
    if (error?.data?.code === "NOT_FOUND") {
      clearCart();
      toast.warning("Invalid products found, cart cleared");
    }
  }, [error, clearCart]);

  if (data?.totalDocs === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="flex items-center border-border/40 bg-white/70 shadow-lg backdrop-blur-sm">
          <File className="text-muted-foreground" />
          <p className="font-medium text-base text-muted-foreground">
            No products found
          </p>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="flex items-center border-border/40 bg-white/70 shadow-lg backdrop-blur-sm">
          <Loader2 className="animate-spin text-muted-foreground" />
          <p className="font-medium text-base text-muted-foreground">
            Just a moment...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <Card className="border-border/40 bg-white/70 shadow-lg backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Your Cart ({totalItems} items)</span>
                <Badge
                  variant="outline"
                  className="border-green-200 bg-green-50 text-green-600"
                >
                  You saved {formatCurrency(20)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data?.docs.map((product, index) => (
                <CheckoutItem
                  key={product.id}
                  isLast={index === data.docs.length - 1}
                  imageUrl={product.image?.url}
                  title={product.title}
                  productUrl={`${generateStoreURL(product.tenant.subdomain)}/products/${product.id}`}
                  storeUrl={generateStoreURL(product.tenant.subdomain)}
                  storeName={product.tenant.name}
                  price={product.price}
                  onRemove={() => removeProduct(product.id.toString())}
                  disabled={false}
                />
              ))}
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex items-center space-x-2 rounded-xl border border-border/40 bg-white/60 p-3 backdrop-blur-sm">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="font-medium text-xs">Secure Payment</span>
            </div>
            <div className="flex items-center space-x-2 rounded-xl border border-border/40 bg-white/60 p-3 backdrop-blur-sm">
              <Truck className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-xs">Instant Download</span>
            </div>
            <div className="flex items-center space-x-2 rounded-xl border border-border/40 bg-white/60 p-3 backdrop-blur-sm">
              <RotateCcw className="h-5 w-5 text-orange-600" />
              <span className="font-medium text-xs">30-Day Refund</span>
            </div>
            <div className="flex items-center space-x-2 rounded-xl border border-border/40 bg-white/60 p-3 backdrop-blur-sm">
              <HeadphonesIcon className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-xs">24/7 Support</span>
            </div>
          </div>
        </div>
        <CheckoutSidebar
          subtotal={data?.subtotal || 0}
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
