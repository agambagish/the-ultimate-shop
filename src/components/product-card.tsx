"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { EyeIcon, HeartIcon, ShoppingBagIcon, StarIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn, formatPrice } from "@/lib/utils";

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  discountPercentage: number;
  thumbnailUrl: string;
  previewImages?: string[];
  fileType: string;
  fileSize: string;
  lastUpdated: string;
  rating: number;
  reviewCount: number;
  vendorId: string;
  vendor: {
    id: string;
    name: string;
    avatarUrl: string;
    verified: boolean;
  };
  categories: string[];
}

interface Props {
  product: Product /* WIP: Replace it with drizzle-zod type */;
  viewType?: "grid" | "list";
}

export function ProductCard({ product, viewType }: Props) {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  if (viewType === "list") {
    return (
      <Card className="overflow-hidden py-0 transition-all duration-300 hover:shadow-md">
        <div className="flex flex-col md:flex-row">
          <div className="relative h-48 w-full md:w-56">
            <Image
              src={product.thumbnailUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 224px"
            />
            {product.discountPercentage > 0 && (
              <Badge
                variant="secondary"
                className="absolute top-2 left-2 text-green-600"
              >
                {product.discountPercentage}% OFF
              </Badge>
            )}
          </div>
          <div className="flex flex-grow flex-col p-6">
            <div className="mb-2 flex items-center justify-between">
              <Link
                href={`/vendors/${product.vendorId}`}
                className="text-muted-foreground text-sm hover:underline"
              >
                {product.vendor.name}
              </Link>
              <div className="flex items-center">
                <StarIcon className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{product.rating}</span>
              </div>
            </div>
            <Link href={`/products/${product.id}`}>
              <h3 className="text-xl font-semibold hover:underline">
                {product.name}
              </h3>
            </Link>
            <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
              {product.description}
            </p>
            <div className="mt-auto flex items-center justify-between pt-4">
              <div className="text-xl font-semibold">
                {formatPrice(product.price)}
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <HeartIcon className="mr-2 h-4 w-4" />
                  Favorite
                </Button>
                <Button size="sm" onClick={handleAddToCart}>
                  <ShoppingBagIcon className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="flex h-full flex-col overflow-hidden py-0 transition-all duration-300 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.thumbnailUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-in-out"
          style={{
            transform: isHovered ? "scale(1.05)" : "scale(1)",
          }}
        />
        {product.discountPercentage > 0 && (
          <Badge
            variant="secondary"
            className="absolute top-2 left-2 text-green-600"
          >
            {product.discountPercentage}% OFF
          </Badge>
        )}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center gap-2 bg-black/60 transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        >
          <Link
            href={`/products/${product.id}`}
            className={buttonVariants({
              size: "sm",
              variant: "secondary",
            })}
          >
            <EyeIcon className="h-4 w-4" />
            View Details
          </Link>
        </div>
      </div>
      <CardContent className="flex-grow p-4">
        <div className="mb-2 flex items-center justify-between">
          <Link
            href={`/vendors/${product.vendorId}`}
            className="text-muted-foreground text-sm hover:underline"
          >
            {product.vendor.name}
          </Link>
          <div className="flex items-center">
            <StarIcon className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs">{product.rating}</span>
          </div>
        </div>
        <Link href={`/products/${product.id}`}>
          <h3 className="line-clamp-1 font-semibold hover:underline">
            {product.name}
          </h3>
        </Link>
        <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
          {product.description}
        </p>
      </CardContent>
      <CardFooter className="mt-auto flex items-center justify-between px-4 pt-0 pb-4">
        <div className="text-lg font-semibold">
          {formatPrice(product.price)}
        </div>
        <Button size="sm" onClick={handleAddToCart}>
          <ShoppingBagIcon className="mr-2 h-4 w-4" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
}
