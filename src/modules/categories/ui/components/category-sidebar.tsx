import { useState } from "react";
import { useRouter } from "next/navigation";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { TQueryResult } from "@/lib/types";
import { useTRPC } from "@/trpc/client";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategorySidebar({ open, onOpenChange }: Props) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

  const router = useRouter();

  const [parentCategories, setParentCategories] =
    useState<TQueryResult<"categories.getMany"> | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<
    TQueryResult<"categories.getMany">[number] | null
  >(null);

  const currentCategories = parentCategories ?? data ?? [];

  function handleOpenChange(open: boolean) {
    setSelectedCategory(null);
    setParentCategories(null);
    onOpenChange(open);
  }

  function handleCategoryClick(
    category: TQueryResult<"categories.getMany">[number],
  ) {
    if (category.other_categories && category.other_categories.length > 0) {
      setParentCategories(
        category.other_categories as TQueryResult<"categories.getMany">,
      );
      setSelectedCategory(category);
    } else {
      if (parentCategories && selectedCategory) {
        router.push(`/products/${selectedCategory.slug}/${category.slug}`);
      } else {
        router.push(
          category.slug === "all" ? "/products" : `/products/${category.slug}`,
        );
      }
      handleOpenChange(false);
    }
  }

  function handleBackClick() {
    if (parentCategories) {
      setParentCategories(null);
      setSelectedCategory(null);
    }
  }

  function handleViewAllClick() {
    if (selectedCategory) {
      router.push(`/products/${selectedCategory.slug}`);
      handleOpenChange(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="left" className="p-0 transition-none">
        <SheetHeader className="border-b p-4">
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex h-full flex-col overflow-y-auto pb-2">
          {parentCategories ? (
            <>
              <button
                type="button"
                onClick={handleBackClick}
                className="flex w-full cursor-pointer items-center p-4 text-left font-medium text-base hover:bg-secondary"
              >
                <ChevronLeft className="mr-2 size-4" />
                Back
              </button>
              <button
                type="button"
                onClick={handleViewAllClick}
                className="flex w-full cursor-pointer items-center justify-between p-4 text-left font-semibold text-primary hover:bg-secondary"
              >
                View all in {selectedCategory?.label}
              </button>
            </>
          ) : (
            <button
              onClick={() =>
                handleCategoryClick({
                  id: NaN,
                  label: "All",
                  slug: "all",
                  other_categories: [],
                })
              }
              type="button"
              className="flex w-full cursor-pointer items-center justify-between p-4 text-left font-medium text-base hover:bg-secondary"
            >
              All
            </button>
          )}
          {currentCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              type="button"
              className="flex w-full cursor-pointer items-center justify-between p-4 text-left font-medium text-base hover:bg-secondary"
            >
              {category.label}
              {category.other_categories &&
                category.other_categories.length > 0 && (
                  <ChevronRight className="size-4" />
                )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
