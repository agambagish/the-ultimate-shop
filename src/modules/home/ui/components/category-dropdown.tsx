"use client";

import { useRef, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { CategoryWithSubCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

import { useDropdownPosition } from "../../hooks/use-dropdown-position";
import { SubcategoryMenu } from "./subcategory-menu";

interface Props {
  category: CategoryWithSubCategory;
  isActive: boolean;
  isHovered: boolean;
}

export function CategoryDropdown({ category, isActive, isHovered }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { getDropdownPosition } = useDropdownPosition(dropdownRef);

  function onMouseEnter() {
    if (category.subcategories) {
      setIsOpen(true);
    }
  }

  function onMouseLeave() {
    setIsOpen(false);
  }

  const dropdownPosition = getDropdownPosition();

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative">
        <Button
          variant="outline"
          className={cn(
            "h-11 rounded-full border-transparent bg-transparent px-4 text-black shadow-none hover:border-primary hover:bg-white",
            isActive && !isHovered && "border-primary bg-white",
          )}
        >
          <Link href={`/${category.slug === "all" ? "/" : category.slug}`}>
            {category.label}
          </Link>
        </Button>
        {category.subcategories && category.subcategories.length > 0 && (
          <div
            className={cn(
              "-bottom-3 -translate-x-1/2 absolute left-1/2 h-0 w-0 border-r-[10px] border-r-transparent border-b-[10px] border-b-black border-l-[10px] border-l-transparent opacity-0",
              isOpen && "opacity-100",
            )}
          />
        )}
      </div>
      <SubcategoryMenu
        category={category}
        isOpen={isOpen}
        position={dropdownPosition}
      />
    </div>
  );
}
