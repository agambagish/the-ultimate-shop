"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { products } from "@/db/schema";
import { ProductCardSkeleton } from "@/features/product/components/product-card-skeleton";
import { Ratings } from "@/features/product/components/ratings";
import { formatPrice } from "@/lib/utils";

interface Props {
  product: Pick<
    typeof products.$inferSelect,
    "id" | "title" | "price" | "discountedPrice" | "images"
  >;
  index: number;
}

export function ProductCard({ product, index }: Props) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 100);

    return () => clearTimeout(timer);
  }, [index]);

  if (!product || !isVisible) return <ProductCardSkeleton />;

  return (
    <Link
      href={`/products/${product.id}`}
      className="flex flex-col items-start"
    >
      <div className="mb-2.5 aspect-square w-full overflow-hidden rounded-[13px] lg:max-w-[295px] lg:rounded-[20px] xl:mb-4">
        <Image
          src={product.images[0]}
          width={295}
          height={298}
          className="h-full w-full rounded-md object-cover transition-all duration-500 hover:scale-110"
          alt={product.title}
          style={{ objectPosition: "center 0%" }}
          quality={100}
          priority
        />
      </div>
      <span className="text-lg font-semibold text-black">{product.title}</span>
      <div className="mb-1 flex items-end xl:mb-2">
        <Ratings
          initialValue={4.2}
          allowFraction
          SVGclassName="inline-block"
          emptyClassName="fill-gray-50"
          size={19}
          readonly
        />
        <span className="ml-[11px] pb-0.5 text-xs text-black xl:ml-[13px] xl:pb-0 xl:text-sm">
          4<span className="text-black/60">/5</span>
        </span>
      </div>
      <div className="flex items-center space-x-[5px] xl:space-x-2.5">
        {product.discountedPrice && Number(product.discountedPrice) === 0 ? (
          <span className="text-lg font-bold text-black">
            {formatPrice(product.price)}
          </span>
        ) : (
          <>
            <span className="text-lg font-bold text-black">
              {formatPrice(product.discountedPrice)}
            </span>
            <span className="text-lg font-bold text-black/40 line-through">
              {formatPrice(product.price)}
            </span>
            <span className="rounded-full bg-[#FF3333]/10 px-3.5 py-1.5 text-[10px] font-medium text-[#FF3333] xl:text-xs">
              {(
                (Number(product.discountedPrice) / Number(product.price)) *
                  100 -
                100
              ).toFixed(2)}
              %
            </span>
          </>
        )}
      </div>
    </Link>
  );
}
