import Image from "next/image";
import Link from "next/link";

import type { products } from "@/db/schema";
import { Ratings } from "@/features/product/components/ratings";
import { formatPrice } from "@/lib/utils";

interface Props {
  product: Pick<
    typeof products.$inferSelect,
    "id" | "title" | "price" | "images"
  >;
}

export function ProductCard({ product }: Props) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="flex aspect-auto flex-col items-start"
    >
      <div className="mb-2.5 aspect-square w-full overflow-hidden rounded-[13px] bg-[#F0EEED] lg:max-w-[295px] lg:rounded-[20px] xl:mb-4">
        <Image
          src={product.images[0]}
          width={295}
          height={298}
          className="h-full w-full rounded-md object-contain transition-all duration-500 hover:scale-110"
          alt={product.title}
          priority
        />
      </div>
      <strong className="text-black xl:text-xl">{product.title}</strong>
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
        <span className="text-xl font-bold text-black xl:text-2xl">
          {formatPrice(639.2)}
        </span>
        <span className="text-xl font-bold text-black/40 line-through xl:text-2xl">
          {formatPrice(799)}
        </span>
        <span className="rounded-full bg-[#FF3333]/10 px-3.5 py-1.5 text-[10px] font-medium text-[#FF3333] xl:text-xs">
          -20%
        </span>
      </div>
    </Link>
  );
}
