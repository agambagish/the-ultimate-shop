"use client";

import { useState } from "react";

import { MinusIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  isZeroDelete?: boolean;
  onAdd?: (value: number) => void;
  onRemove?: (value: number) => void;
  className?: string;
  initialValue?: number;
}

export function CartCounter({
  className,
  initialValue = 1,
  isZeroDelete,
  onAdd,
  onRemove,
}: Props) {
  const [counter, setCounter] = useState<number>(initialValue);

  function addToCart() {
    if (onAdd) {
      onAdd(counter + 1);
    }
    setCounter(counter + 1);
  }

  function remove() {
    if ((counter === 1 && !isZeroDelete) || counter <= 0) return;

    if (onRemove) {
      onRemove(counter - 1);
    }
    if (counter - 1 <= 0) return;
    setCounter(counter - 1);
  }

  return (
    <div
      className={cn(
        "flex w-full max-w-[110px] min-w-[110px] items-center justify-between rounded-lg bg-[#F0F0F0] px-4 py-3 sm:max-w-[170px] sm:px-5 md:py-3.5",
        className
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        type="button"
        className="h-5 w-5 text-xl hover:bg-transparent sm:h-6 sm:w-6"
        onClick={() => remove()}
      >
        <MinusIcon />
      </Button>
      <span className="text-sm font-medium sm:text-base">
        {!isZeroDelete ? counter : initialValue}
      </span>
      <Button
        variant="ghost"
        size="icon"
        type="button"
        className="h-5 w-5 text-xl hover:bg-transparent sm:h-6 sm:w-6"
        onClick={() => addToCart()}
      >
        <PlusIcon />
      </Button>
    </div>
  );
}
