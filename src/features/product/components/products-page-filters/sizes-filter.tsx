"use client";

import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export function SizesFilter() {
  const [selected, setSelected] = useState<string>("Large");

  return (
    <Accordion type="single" collapsible defaultValue="filter-size">
      <AccordionItem value="filter-size" className="border-none">
        <AccordionTrigger className="p-0 py-0.5 text-xl font-bold text-black hover:no-underline">
          Size
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="flex flex-wrap items-center">
            {[
              "XX-Small",
              "X-Small",
              "Small",
              "Medium",
              "Large",
              "X-Large",
              "XX-Large",
              "3X-Large",
              "4X-Large",
            ].map((size, index) => (
              <button
                key={index}
                type="button"
                className={cn([
                  "m-1 flex max-h-[39px] items-center justify-center rounded-full bg-[#F0F0F0] px-5 py-2.5 text-sm",
                  selected === size && "bg-black font-medium text-white",
                ])}
                onClick={() => setSelected(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
