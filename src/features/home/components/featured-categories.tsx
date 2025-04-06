import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { ArrowRightIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getFeaturedCategories } from "@/features/home/queries";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  description: string;
}

export async function FeaturedCategories({ title, description }: Props) {
  const { categories } = await getFeaturedCategories();

  return (
    <section className="bg-gray-50 px-4 py-16 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            {title}
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">{description}</p>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category, i) => (
            <Suspense
              key={i}
              fallback={
                <Card className="overflow-hidden bg-white">
                  <div className="relative h-[300px] overflow-hidden">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Skeleton className="mb-2 h-6 w-32" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </CardContent>
                </Card>
              }
            >
              <Card className="group cursor-pointer overflow-hidden bg-white py-0">
                <div className="relative h-[300px] overflow-hidden">
                  <Image
                    src={category.imageUrl}
                    alt={category.label}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    style={{ objectPosition: "center 0%" }}
                    fill
                  />
                  <div className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/30" />
                </div>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {category.label}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {category.productCount} items
                      </p>
                    </div>
                    <Link
                      href={`/products?category=${category.slug}`}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      )}
                    >
                      <ArrowRightIcon className="h-5 w-5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </Suspense>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="#"
            className={cn(buttonVariants({ variant: "outline" }), "px-6")}
          >
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  );
}
