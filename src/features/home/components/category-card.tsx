"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { PackageIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { categories } from "@/db/schema";

interface Props {
  category: Omit<typeof categories.$inferSelect, "id"> & {
    productCount: number;
  };
  index: number;
}

export function CategoryCard({ category, index }: Props) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 100);

    return () => clearTimeout(timer);
  }, [index]);

  if (!category || !isVisible)
    return <Skeleton className="aspect-square h-full rounded-lg" />;

  return (
    <Link href={`/products?category=${category.slug}`}>
      <Card
        className="hover:bg-muted/25 aspect-square rounded-lg transition-colors"
        style={{
          backgroundImage: `url(${category.imageUrl})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
      >
        <CardHeader className="flex-1">
          <CardTitle className="text-xl font-extrabold text-neutral-700">
            {category.label}
          </CardTitle>
          <CardDescription className="line-clamp-3 text-balance text-neutral-700">
            Lorem ipsum dolor sit amet consectetur adipisicing.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex w-fit items-center text-[0.8rem] text-neutral-700">
            <PackageIcon className="mr-1.5 size-3.5" />
            {category.productCount} products
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
