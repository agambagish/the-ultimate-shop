import { CircleX, Shield } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

import type { CardSchema, UPISchema } from "../../lib/schemas";
import { PaymentMethodSelector } from "./payment-method-selector";

interface Props {
  subtotal: number;
  totalItems: number;
  onCardCheckout: (values: CardSchema) => void;
  onUPICheckout: (values: UPISchema) => void;
  isCancelled?: boolean;
  disabled?: boolean;
}

export function CheckoutSidebar({
  onCardCheckout,
  onUPICheckout,
  subtotal,
  isCancelled,
  disabled,
  totalItems,
}: Props) {
  return (
    <div className="space-y-6 lg:col-span-5">
      <Card className="border-border/40 bg-white/70 shadow-lg backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal ({totalItems} items)</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-green-600 text-sm">
              <span>Savings</span>
              <span>-{formatCurrency(Math.round(subtotal * 1.4))}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(subtotal)}</span>
            </div>
          </div>
          <PaymentMethodSelector
            onCardCheckout={onCardCheckout}
            onUPICheckout={onUPICheckout}
            disabled={disabled}
          />
          <div className="flex items-center justify-center space-x-2 text-muted-foreground text-xs">
            <Shield className="h-4 w-4" />
            <span>Your payment information is secure and encrypted</span>
          </div>
        </CardContent>
      </Card>
      {isCancelled && (
        <Card className="border-border/40 bg-white/70 p-4 shadow-lg backdrop-blur-sm">
          <div className="flex w-full items-center rounded-lg border border-red-400 bg-red-100 px-4 py-3 font-medium">
            <div className="flex items-center">
              <CircleX className="mr-2 size-6 fill-red-500 text-red-100" />
              <span>Checkout failed. Please try again.</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
