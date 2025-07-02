import Link from "next/link";

import * as Icons from "lucide-react";

import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { FeaturedStores } from "@/modules/home/components/featured-stores";
import { HeroSection } from "@/modules/home/components/hero-section";
import { getCategories } from "@/modules/home/server/get-categories";
import { getFeaturedStores } from "@/modules/home/server/get-featured-stores";
import { getTrendingProducts } from "@/modules/home/server/get-trending-products";

export default async function Page() {
  const [trendingProducts, categories, featuredStores] = await Promise.all([
    getTrendingProducts(),
    getCategories(),
    getFeaturedStores(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:py-8">
      <HeroSection />
      <section className="mt-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Trending Products
          </h2>
          <Button variant="link" size="sm">
            View all
          </Button>
        </div>
        {trendingProducts.length === 0 && (
          <div className="flex justify-center py-12">
            <p className="text-muted-foreground text-sm">
              There&apos;s no trending products at this time
            </p>
          </div>
        )}
        {trendingProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {trendingProducts.map((product, i) => (
              <ProductCard key={i} product={product} />
            ))}
          </div>
        )}
      </section>
      <section className="mt-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Browse Categories
          </h2>
          <Button variant="link" size="sm">
            All categories
          </Button>
        </div>
        <ScrollArea className="w-full pb-4 whitespace-nowrap">
          <div className="flex gap-4">
            {categories.map((category, i) => {
              const Icon = Icons[
                category.icon as keyof typeof Icons
              ] as Icons.LucideIcon;

              return (
                <Link
                  key={i}
                  href={`/products?category=${category.slug}`}
                  className="size-[220px]"
                >
                  <Card className="transition-shadow hover:shadow-md">
                    <CardContent className="flex flex-col items-center p-4 text-center">
                      <div className="bg-primary/10 text-primary mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                        <Icon className="size-6" />
                      </div>
                      <h3 className="font-medium">{category.label}</h3>
                      <p className="text-muted-foreground line-clamp-1 text-sm">
                        {category.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>
      <section className="mt-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Featured Stores</h2>
        </div>
        <FeaturedStores stores={featuredStores} />
      </section>
    </div>
  );
}
