"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { getNewArrivals } from "@/features/home/queries";
import { ProductCard } from "@/features/product/components/product-card";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  description: string;
  newArrivalsPromise: Promise<Awaited<ReturnType<typeof getNewArrivals>>>;
}

export function ProductList({ title, description, newArrivalsPromise }: Props) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [_, setIsMobile] = useState<boolean>(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(4);
  const { products } = use(newArrivalsPromise);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      if (width >= 1280) setItemsPerPage(4);
      else if (width >= 768) setItemsPerPage(3);
      else if (width >= 640) setItemsPerPage(2);
      else setItemsPerPage(1);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, products.length - itemsPerPage);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(maxIndex, prevIndex + 1));
  };

  return (
    <section className="bg-gray-50 px-4 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
            <p className="mt-2 text-gray-600">{description}</p>
          </div>
          <div className="hidden space-x-2 md:flex">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="h-10 w-10 rounded-full"
              aria-label="Previous products"
            >
              <ChevronLeftIcon className="size-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="h-10 w-10 rounded-full"
              aria-label="Next products"
            >
              <ChevronRightIcon className="size-5" />
            </Button>
          </div>
        </div>
        <div className="w-full md:hidden">
          <Carousel className="w-full">
            <CarouselContent>
              {products.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="basis-full sm:basis-1/2"
                >
                  <div className="p-1">
                    <ProductCard product={product} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 bg-white" />
            <CarouselNext className="right-2 bg-white" />
          </Carousel>
        </div>
        <div className="relative hidden overflow-hidden md:block">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="w-full flex-shrink-0 px-3 sm:w-1/2 md:w-1/3 xl:w-1/4"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 flex justify-center md:hidden">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              className={`mx-1 h-2 w-2 rounded-full ${currentIndex === index ? "bg-gray-800" : "bg-gray-300"}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="#"
            className={cn(buttonVariants({ variant: "outline" }), "px-6")}
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
