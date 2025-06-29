import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/modules/home/components/hero-section";
import { getTrendingProducts } from "@/modules/home/server/get-trending-products";

export default async function Page() {
  const trendingProducts = await getTrendingProducts();

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
    </div>
  );
}
