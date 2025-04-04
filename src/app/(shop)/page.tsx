import { HeroCarousel } from "@/features/home/components/hero-carousel";
import { slides } from "@/features/home/lib/config";

export default function Page() {
  return (
    <>
      <HeroCarousel slides={slides} />
    </>
  );
}
