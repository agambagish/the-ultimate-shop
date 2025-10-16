import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, TriangleAlert } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import type { CardSchema, UPISchema } from "../../lib/schemas";
import { cardSchema, upiSchema } from "../../lib/schemas";

interface Props {
  onCardCheckout: (values: CardSchema) => void;
  onUPICheckout: (values: UPISchema) => void;
  disabled?: boolean;
}

export function PaymentMethodSelector({
  onCardCheckout,
  onUPICheckout,
  disabled,
}: Props) {
  const [method, setMethod] = useState<"card" | "upi" | null>(null);

  const cardForm = useForm<CardSchema>({
    resolver: zodResolver(cardSchema),
    mode: "onChange",
    defaultValues: {
      cardNumber: "",
      cvv: "",
      expiryDate: "",
    },
  });

  const upiForm = useForm<UPISchema>({
    resolver: zodResolver(upiSchema),
    mode: "onChange",
    defaultValues: {
      vpa: "",
    },
  });

  function handleCardSubmit(values: CardSchema) {
    onCardCheckout(values);
  }

  function handleUpiSubmit(values: UPISchema) {
    onUPICheckout(values);
  }

  function handleMethodChange(method: "card" | "upi") {
    setMethod(method);
    cardForm.reset();
    upiForm.reset();
  }

  return (
    <>
      <div className="space-y-4">
        <h3 className="font-semibold">Payment Methods</h3>
        <RadioGroup
          value={method}
          onValueChange={(value) => handleMethodChange(value as "card" | "upi")}
          disabled={disabled}
        >
          <div className="flex items-center space-x-3 rounded-lg border border-border/40 p-3 transition-colors hover:bg-white/60">
            <RadioGroupItem value="upi" disabled={disabled} />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 48 48"
              className="size-6"
            >
              <title>UPI</title>
              <polygon fill="#388e3c" points="29,4 18,45 40,24" />
              <polygon fill="#f57c00" points="21,3 10,44 32,23" />
            </svg>
            <div className="flex-1">
              <Label className="cursor-pointer font-medium">UPI</Label>
              <p className="text-muted-foreground text-xs">Pay using VPA</p>
            </div>
          </div>
          {method === "upi" && (
            <div className="flex items-center space-x-3 rounded-lg border border-border/40 p-4 transition-colors hover:bg-white/60">
              <Form {...upiForm}>
                <form
                  onSubmit={upiForm.handleSubmit(handleUpiSubmit)}
                  className="w-full space-y-4"
                >
                  <FormField
                    control={upiForm.control}
                    name="vpa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>VPA</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="user@upi"
                            autoComplete="off"
                            spellCheck="false"
                            disabled={disabled}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>
          )}
          <div className="flex items-center space-x-3 rounded-lg border border-border/40 p-3 transition-colors hover:bg-white/60">
            <RadioGroupItem value="card" disabled={disabled} />
            <CreditCard className="size-5" />
            <div className="flex-1">
              <Label className="cursor-pointer font-medium">
                Credit/Debit Card
              </Label>
              <p className="text-muted-foreground text-xs">
                Visa, Mastercard, RuPay
              </p>
            </div>
          </div>
          {method === "card" && (
            <div className="flex w-full items-center rounded-lg border border-amber-400 bg-amber-100 px-4 py-3 font-medium">
              <div className="flex items-center">
                <TriangleAlert className="mr-2 size-6 fill-amber-500 text-amber-100" />
                <span>Card payments temporarily unavailable.</span>
              </div>
            </div>
          )}
        </RadioGroup>
      </div>
      <Button
        onClick={
          method === "card"
            ? cardForm.handleSubmit(handleCardSubmit)
            : upiForm.handleSubmit(handleUpiSubmit)
        }
        disabled={
          !method || method === "card"
            ? !cardForm.formState.isValid
            : !upiForm.formState.isValid || disabled
        }
        className="shiny-button h-14 w-full cursor-pointer font-semibold text-lg shadow-lg"
      >
        Continue to Payment
      </Button>
    </>
  );
}
