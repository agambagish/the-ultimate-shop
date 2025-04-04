import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Slide } from "@/features/home/lib/types";

interface Props {
  slides: Slide[];
}

export function HeroCarousel({ slides }: Props) {
  return (
    <section className="relative h-[600px] w-full bg-gray-100">
      <Carousel className="h-full w-full" opts={{ loop: true }}>
        <CarouselContent className="h-full" style={{ height: "600px" }}>
          {slides.map((slide, i) => (
            <CarouselItem key={i} className="h-full">
              <div className="relative h-full w-full">
                <div className="absolute inset-0 h-full w-full overflow-hidden">
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="h-full w-full object-cover object-top"
                    style={{ objectPosition: "center 30%" }}
                    fill
                  />
                  <div className="absolute inset-0 bg-black/30" />
                </div>
                <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-start justify-center px-6 md:px-12 lg:px-16">
                  <div className="max-w-xl">
                    <h1 className="mb-4 text-4xl leading-tight font-bold text-white md:text-5xl lg:text-6xl">
                      {slide.title}
                    </h1>
                    <p className="mb-8 max-w-lg text-lg text-white/90 md:text-xl">
                      {slide.description}
                    </p>
                    <Link
                      href={slide.buttonUrl}
                      className={buttonVariants({
                        size: "lg",
                        variant: "secondary",
                      })}
                    >
                      {slide.buttonText}
                    </Link>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 border-none bg-white/20 text-white hover:bg-white/40 lg:left-8" />
        <CarouselNext className="right-4 border-none bg-white/20 text-white hover:bg-white/40 lg:right-8" />
      </Carousel>
    </section>
  );
}
