"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ListFilter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

import { CategoryDropdown } from "./category-dropdown";
import { CategorySidebar } from "./category-sidebar";

export function CategoryBar() {
  const params = useParams();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const viewAllRef = useRef<HTMLDivElement>(null);

  const [visibleCount, setVisibleCount] = useState<number>(data.length);
  const [isAnyHovered, setIsAnyHovered] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const categoryParam = params.category as string | undefined;
  const activeCategory = categoryParam || "all";

  const activeCategoryIndex = data.findIndex((c) => c.slug === activeCategory);
  const isActiveCategoryHidden =
    activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1;

  // biome-ignore lint/correctness/useExhaustiveDependencies: _
  useEffect(() => {
    function calculateVisible() {
      if (!containerRef.current || !measureRef.current || !viewAllRef.current)
        return;

      const containerWidth = containerRef.current.offsetWidth;
      const viewAllWidth = viewAllRef.current.offsetWidth;
      const availableWidth = containerWidth - viewAllWidth;

      const items = Array.from(measureRef.current.children);
      let totalWidth = 0;
      let visible = 0;

      for (const item of items) {
        const width = item.getBoundingClientRect().width;

        if (totalWidth + width > availableWidth) break;
        totalWidth += width;
        visible++;
      }

      setVisibleCount(visible);
    }

    const resizeObserver = new ResizeObserver(calculateVisible);
    // biome-ignore lint/style/noNonNullAssertion: _
    resizeObserver.observe(containerRef.current!);

    return () => resizeObserver.disconnect();
  }, [data.length]);

  return (
    <div className="relative w-full">
      <CategorySidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
      <div
        ref={measureRef}
        className="pointer-events-none absolute flex opacity-0"
        style={{ position: "fixed", top: -9999, left: -9999 }}
      >
        {data.map((category) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={activeCategory === category.slug}
              isHovered={false}
            />
          </div>
        ))}
      </div>
      <div
        ref={containerRef}
        className="flex flex-nowrap items-center"
        onMouseEnter={() => setIsAnyHovered(true)}
        onMouseLeave={() => setIsAnyHovered(false)}
      >
        <div>
          <CategoryDropdown
            category={{
              id: NaN,
              label: "All",
              slug: "all",
              other_categories: [],
            }}
            isActive={activeCategory === "all"}
            isHovered={isAnyHovered}
          />
        </div>
        {data.slice(0, visibleCount).map((category) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={activeCategory === category.slug}
              isHovered={isAnyHovered}
            />
          </div>
        ))}
        <div ref={viewAllRef} className="shrink-0">
          <Button
            variant="link"
            className={cn(
              "cursor-pointer text-black",
              isActiveCategoryHidden && !isAnyHovered && "underline",
            )}
            onClick={() => setIsSidebarOpen(true)}
          >
            View All
            <ListFilter />
          </Button>
        </div>
      </div>
    </div>
  );
}
