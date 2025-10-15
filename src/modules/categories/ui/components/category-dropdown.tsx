"use client";

import { useRef, useState } from "react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import type { CategoryWithSubCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

import { SubcategoryMenu } from "./subcategory-menu";

interface Props {
  category: CategoryWithSubCategory;
  isActive: boolean;
  isHovered: boolean;
}

export function CategoryDropdown({ category, isActive, isHovered }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  function onMouseEnter() {
    if (category.subcategories) {
      setIsOpen(true);
    }
  }

  function onMouseLeave() {
    setIsOpen(false);
  }

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative">
        <Link
          href={`/products/${category.slug === "all" ? "/" : category.slug}`}
          className={cn(
            buttonVariants({ variant: "link" }),
            "text-black",
            isActive && !isHovered && "underline",
          )}
        >
          {category.label}
        </Link>
      </div>
      <SubcategoryMenu category={category} isOpen={isOpen} />
    </div>
  );
}
