"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

import { useProductFilters } from "../../hooks/use-product-filters";
import { PriceFilter } from "./price-filter";

export function ProductFilters() {
  const [filters, setFilters] = useProductFilters();

  function onChange(key: keyof typeof filters, value: unknown) {
    setFilters({ ...filters, [key]: value });
  }

  return (
    <div className="hidden flex-shrink-0 lg:block">
      <div className="sticky top-24 h-fit w-72 rounded-2xl border border-border/40 bg-white/60 p-6 backdrop-blur-sm">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground text-lg">Filters</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-auto px-2 py-1 text-muted-foreground text-xs hover:text-foreground"
              >
                Clear All
              </Button>
            </div>
          </div>
          <Accordion
            defaultValue={["price"]}
            type="multiple"
            className="w-full"
          >
            <AccordionItem value="price" className="border-border/40">
              <AccordionTrigger className="py-3 font-medium text-sm hover:no-underline">
                Price Range
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4">
                <PriceFilter
                  minPrice={filters.minPrice}
                  maxPrice={filters.maxPrice}
                  onMinPriceChange={(value) => onChange("minPrice", value)}
                  onMaxPriceChange={(value) => onChange("maxPrice", value)}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
