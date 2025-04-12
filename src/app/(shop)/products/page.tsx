import Link from "next/link";

import { SlidersIcon } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ProductCard } from "@/features/product/components/product-card";
import { ProductsPageFilters } from "@/features/product/components/products-page-filters";
import { MobileFilters } from "@/features/product/components/products-page-filters/mobile-filters";
import { getProducts } from "@/features/product/queries";

export default async function Page() {
  const { products } = await getProducts();

  return (
    <main className="pb-6">
      <div className="mx-auto max-w-7xl px-4 xl:px-0">
        <Breadcrumb className="my-6 pl-1">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Products</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-start md:space-x-5">
          <div className="hidden max-w-[295px] min-w-[295px] space-y-5 rounded-lg border border-black/10 px-5 py-5 md:block md:space-y-6 md:px-6">
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-black">Filters</span>
              <SlidersIcon className="text-2xl text-black/40" />
            </div>
            <ProductsPageFilters />
          </div>
          <div className="flex w-full flex-col space-y-5">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold md:text-4xl">
                Explore Products
              </h1>
              <MobileFilters />
            </div>
            <div className="xs:grid-cols-2 grid w-full grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {products.map((product, i) => (
                <ProductCard key={i} product={product} index={i} />
              ))}
            </div>
            <Pagination className="justify-between">
              <PaginationPrevious href="#" className="border border-black/10" />
              <PaginationContent>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    className="text-sm font-medium text-black/50"
                    isActive
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    className="text-sm font-medium text-black/50"
                  >
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem className="hidden lg:block">
                  <PaginationLink
                    href="#"
                    className="text-sm font-medium text-black/50"
                  >
                    3
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis className="text-sm font-medium text-black/50" />
                </PaginationItem>
                <PaginationItem className="hidden lg:block">
                  <PaginationLink
                    href="#"
                    className="text-sm font-medium text-black/50"
                  >
                    8
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem className="hidden sm:block">
                  <PaginationLink
                    href="#"
                    className="text-sm font-medium text-black/50"
                  >
                    9
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    className="text-sm font-medium text-black/50"
                  >
                    10
                  </PaginationLink>
                </PaginationItem>
              </PaginationContent>

              <PaginationNext href="#" className="border border-black/10" />
            </Pagination>
          </div>
        </div>
      </div>
    </main>
  );
}
