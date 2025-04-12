import { SlidersIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ProductsPageFilters } from "@/features/product/components/products-page-filters";

export function MobileFilters() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size="icon" variant="outline" className="flex md:hidden">
          <SlidersIcon className="size-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90%]">
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-black">Filters</span>
            <SlidersIcon className="text-muted-foreground size-5" />
          </div>
          <DrawerTitle className="hidden">filters</DrawerTitle>
          <DrawerDescription className="hidden">filters</DrawerDescription>
        </DrawerHeader>
        <div className="max-h-[90%] w-full space-y-5 overflow-y-auto px-5 py-5 md:space-y-6 md:px-6">
          <ProductsPageFilters />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
