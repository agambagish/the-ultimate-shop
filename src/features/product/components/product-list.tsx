import { use } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { products } from "@/db/schema";
import { ProductCard } from "@/features/product/components/product-card";

interface Props {
  title: string;
  description: string;
  productsPromise: Promise<{
    products: Pick<
      typeof products.$inferSelect,
      "id" | "title" | "price" | "discountedPrice" | "images"
    >[];
  }>;
}

export function ProductList({ title, description, productsPromise }: Props) {
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
      </div>
    </section>
  );
}
