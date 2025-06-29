"use client";

import Image from "next/image";
import { useState } from "react";

import {
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MaximizeIcon,
  MinimizeIcon,
} from "lucide-react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import type { Product } from "@/db/schema";
import { cn } from "@/lib/utils";

interface Props {
  product: Pick<
    Product,
    "imageURL1" | "imageURL2" | "imageURL3" | "imageURL4" | "imageURL5"
  >;
}

export function ProductPreview({ product }: Props) {
  const [activeImage, setActiveImage] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const { imageURL1, imageURL2, imageURL3, imageURL4, imageURL5 } = product;

  const images = [imageURL1, imageURL2, imageURL3, imageURL4, imageURL5];

  const previews = images.filter((e) => e !== null);

  function toggleFullscreen() {
    setIsFullscreen(!isFullscreen);
  }

  function nextImage() {
    setActiveImage((prev) => (prev + 1) % previews.length);
  }

  function prevImage() {
    setActiveImage((prev) => (prev - 1 + previews.length) % previews.length);
  }

  return (
    <div
      className={cn(
        "relative",
        isFullscreen &&
          "bg-background/90 fixed inset-0 z-50 flex items-center justify-center p-6"
      )}
    >
      {isFullscreen && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-50"
          onClick={toggleFullscreen}
        >
          <MinimizeIcon className="size-5" />
        </Button>
      )}
      <div className="relative">
        <AspectRatio
          ratio={1 / 1}
          className="bg-muted overflow-hidden rounded-lg"
        >
          <Image
            src={previews[activeImage]}
            alt="image"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </AspectRatio>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-3">
          <Button
            variant="secondary"
            size="icon"
            className="pointer-events-auto rounded-full opacity-80 hover:opacity-100"
            onClick={prevImage}
          >
            <ChevronsLeftIcon className="size-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="pointer-events-auto rounded-full opacity-80 hover:opacity-100"
            onClick={nextImage}
          >
            <ChevronsRightIcon className="size-5" />
          </Button>
        </div>
        {!isFullscreen && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-3 bottom-3"
            onClick={toggleFullscreen}
          >
            <MaximizeIcon className="size-4" />
          </Button>
        )}
      </div>
      {!isFullscreen && previews.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-auto pb-1">
          {previews.map((url, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              className={cn(
                "relative h-20 w-20 overflow-hidden rounded-md border-2 transition-all",
                activeImage === i
                  ? "border-primary"
                  : "hover:border-muted-foreground/30 border-transparent"
              )}
            >
              <Image
                src={url}
                alt={`Preview ${i + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
