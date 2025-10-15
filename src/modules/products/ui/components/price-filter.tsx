"use client";

import type { ChangeEvent } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatAsCurrency } from "@/lib/utils";

interface Props {
  minPrice?: string | null;
  maxPrice?: string | null;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
}

export function PriceFilter({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
}: Props) {
  function handleMinPriceChange(e: ChangeEvent<HTMLInputElement>) {
    const numericValue = e.target.value.replace(/[^0-9.]/g, "");
    onMinPriceChange(numericValue);
  }

  function handleMaxPriceChange(e: ChangeEvent<HTMLInputElement>) {
    const numericValue = e.target.value.replace(/[^0-9.]/g, "");
    onMaxPriceChange(numericValue);
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1">
        <Label
          htmlFor="min-price"
          className="font-medium text-muted-foreground text-xs"
        >
          Min Price
        </Label>
        <Input
          type="text"
          placeholder="₹0"
          value={minPrice ? formatAsCurrency(minPrice) : ""}
          onChange={handleMinPriceChange}
          className="h-9 border-border/40 bg-background/70 text-sm transition-all focus:border-primary/60 focus:bg-background/90"
        />
      </div>
      <div className="space-y-1">
        <Label
          htmlFor="max-price"
          className="font-medium text-muted-foreground text-xs"
        >
          Max Price
        </Label>
        <Input
          type="text"
          placeholder="∞"
          value={maxPrice ? formatAsCurrency(maxPrice) : ""}
          onChange={handleMaxPriceChange}
          className="h-9 border-border/40 bg-background/70 text-sm transition-all focus:border-primary/60 focus:bg-background/90"
        />
      </div>
    </div>
  );
}
