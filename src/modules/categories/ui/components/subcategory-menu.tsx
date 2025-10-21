"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { createPortal } from "react-dom";

import type { TQueryResult } from "@/lib/types";

interface Props {
  category: TQueryResult<"categories.getMany">[0];
  isOpen: boolean;
}

export function SubcategoryMenu({ category, isOpen }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (ref.current && isOpen) {
      const rect = ref.current.getBoundingClientRect();
      setPosition({ top: rect.bottom, left: rect.left });
    }
  }, [isOpen]);

  if (!isOpen || !category.other_categories.length) return null;

  const menu = (
    <div
      className="fixed z-[999999] w-60 rounded-2xl border bg-background text-black shadow-lg"
      style={{ top: position.top, left: position.left }}
    >
      {category.other_categories.map((subcategory) => (
        <Link
          key={subcategory.slug}
          href={`/products/${category.slug}/${subcategory.slug}`}
          className="block w-full p-4 font-medium first:rounded-t-2xl last:rounded-b-2xl hover:bg-secondary hover:underline"
        >
          {subcategory.label}
        </Link>
      ))}
    </div>
  );

  return (
    <>
      <div ref={ref} />
      {createPortal(menu, document.body)}
    </>
  );
}
