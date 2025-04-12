import { FeaturedCategories } from "@/features/home/components/featured-categories";
import { HeroCarousel } from "@/features/home/components/hero-carousel";
import { Newsletter } from "@/features/home/components/newsletter";
import { slides } from "@/features/home/lib/config";
import { getNewArrivals } from "@/features/home/queries";
import { ProductList } from "@/features/product/components/product-list";

export default function Page() {
  return (
    <>
      <HeroCarousel slides={slides} />
      <FeaturedCategories
        title="Shop by Category"
        description="Browse our featured collections and find exactly what you're looking for"
      />
      <ProductList
        title="New Arrivals"
        description="Check out our latest products and find your new favorites"
        productsPromise={getNewArrivals()}
      />
      <Newsletter />
    </>
  );
}
