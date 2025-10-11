"use client";

import { useState } from "react";

import { StarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface Props {
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
}

export function StarPicker({ value = 0, disabled, onChange }: Props) {
  const [hoverValue, setHoverValue] = useState<number>(0);

  return (
    <div
      className={cn(
        "flex items-center",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          className={cn(
            "p-0.5 transition hover:scale-110",
            !disabled && "cursor-pointer",
            disabled && "hover:scale-100",
          )}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(0)}
        >
          <StarIcon
            className={cn(
              "size-5",
              (value || hoverValue) >= star
                ? "fill-yellow-400 text-yellow-400"
                : "text-yellow-400",
            )}
          />
        </button>
      ))}
    </div>
  );
}
