"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tabs = [
  {
    label: "Product Details",
    value: "product-details",
  },
  {
    label: "Ratings & Reviews",
    value: "ratings-n-reviews",
  },
  {
    label: "FAQs",
    value: "faqs",
  },
];

interface Props {
  details: { label: string; value: string }[];
}

export function ProductDetailsTabs({ details }: Props) {
  const [active, setActive] = useState<number>(0);

  return (
    <>
      <div className="mb-6 flex items-center overflow-x-auto sm:mb-8">
        {tabs.map((tab, i) => (
          <Button
            key={i}
            variant="ghost"
            type="button"
            className={cn([
              active === i
                ? "border-b-2 border-black font-medium"
                : "border-b border-black/10 font-normal text-black/60",
              "flex-1 rounded-none p-5 sm:p-6",
            ])}
            onClick={() => setActive(i)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      <div className="mb-12 sm:mb-16">
        {active === 0 && (
          <section>
            <h3 className="mb-5 text-xl font-bold sm:mb-6 sm:text-2xl">
              Product specifications
            </h3>
            {details.map((detail, i) => (
              <div className="grid grid-cols-3" key={i}>
                <div>
                  <p className="w-full py-3 pr-2 text-sm leading-7 text-neutral-500 lg:py-4">
                    {detail.label}
                  </p>
                </div>
                <div className="col-span-2 border-b py-3 lg:py-4">
                  <p className="w-full text-sm leading-7 font-medium text-neutral-800">
                    {detail.value}
                  </p>
                </div>
              </div>
            ))}
          </section>
        )}
        {active === 1 && <>WIP: Ratings & Reviews</>}
        {active === 2 && <>WIP: FAQs</>}
      </div>
    </>
  );
}
