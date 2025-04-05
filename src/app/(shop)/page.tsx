import { FeaturedCategories } from "@/features/home/components/featured-categories";
import { HeroCarousel } from "@/features/home/components/hero-carousel";
import { slides } from "@/features/home/lib/config";

export default function Page() {
  return (
    <>
      <HeroCarousel slides={slides} />
      <FeaturedCategories
        title="Shop by Category"
        description="Browse our featured collections and find exactly what you're looking for"
      />
    </>
  );
}
