import { Button } from "@/components/ui/button";
import { CategoriesFilter } from "@/features/product/components/products-page-filters/categories-filter";
import { ColorsFilter } from "@/features/product/components/products-page-filters/colors-filter";
import { PriceFilter } from "@/features/product/components/products-page-filters/price-filter";
import { SizesFilter } from "@/features/product/components/products-page-filters/sizes-filter";
import { getCategories } from "@/features/product/queries";

export function ProductsPageFilters() {
  return (
    <>
      <hr className="border-t-black/10" />
      <CategoriesFilter categoriesPromise={getCategories()} />
      <hr className="border-t-black/10" />
      <PriceFilter />
      <hr className="border-t-black/10" />
      <ColorsFilter />
      <hr className="border-t-black/10" />
      <SizesFilter />
      <Button
        type="button"
        className="h-12 w-full rounded-full bg-black py-4 text-sm font-medium"
      >
        Apply Filter
      </Button>
    </>
  );
}
