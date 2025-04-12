import Link from "next/link";
import { use } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { getNewArrivals } from "@/features/home/queries";
import { ProductCard } from "@/features/product/components/product-card";

interface Props {
  title: string;
  description: string;
  buttonLink?: string;
  productsPromise: Promise<Awaited<ReturnType<typeof getNewArrivals>>>;
}

export function ProductList({
  title,
  description,
  buttonLink,
  productsPromise,
}: Props) {
  const { products } = use(productsPromise);

  return (
    <section className="mx-auto max-w-7xl text-center">
      <div className="mb-8 md:mb-12">
        <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
          {title}
        </h2>
        <p className="mx-auto max-w-2xl text-gray-600">{description}</p>
      </div>
      <div>
        <Carousel
          opts={{
            align: "start",
          }}
          className="mb-6 w-full md:mb-9"
        >
          <CarouselContent className="mx-4 space-x-4 sm:space-x-5 xl:mx-0">
            {products.map((product, i) => (
              <CarouselItem
                key={product.id}
                className="w-full max-w-[198px] pl-0 sm:max-w-[295px]"
              >
                <ProductCard product={product} index={i} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        {buttonLink && (
          <div className="w-full px-4 text-center sm:px-0">
            <Link
              href={buttonLink}
              className="inline-block w-full rounded-full border border-black/10 px-[54px] py-4 text-sm font-medium text-black transition-all hover:bg-black hover:text-white sm:w-[218px] sm:text-base"
            >
              View All
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
