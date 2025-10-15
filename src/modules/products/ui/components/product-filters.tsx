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
import { TagsFilter } from "./tags-filter";

export function ProductFilters() {
  const [filters, setFilters] = useProductFilters();

  const hasAnyFilters = Object.entries(filters).some(([_, value]) => {
    if (typeof value === "string") {
      return value !== "";
    }

    return value !== null;
  });

  function onChange(key: keyof typeof filters, value: unknown) {
    setFilters({ ...filters, [key]: value });
  }

  function onClear() {
    setFilters({
      minPrice: "",
      maxPrice: "",
      tags: [],
    });
  }

  return (
    <div className="hidden flex-shrink-0 lg:block">
      <div className="sticky top-24 h-fit w-72 rounded-2xl border border-border/40 bg-background/60 p-6 backdrop-blur-sm">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground text-lg">Filters</h3>
            {hasAnyFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto cursor-pointer px-2 py-1 text-muted-foreground text-xs hover:text-foreground"
                onClick={onClear}
              >
                Clear All
              </Button>
            )}
          </div>
          <Accordion type="multiple" className="w-full">
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
            <AccordionItem value="tags" className="border-border/40">
              <AccordionTrigger className="py-3 font-medium text-sm hover:no-underline">
                Tags
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4">
                <TagsFilter
                  values={filters.tags}
                  onChange={(value) => onChange("tags", value)}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
