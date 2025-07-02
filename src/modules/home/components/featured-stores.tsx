"use client";

import Link from "next/link";
import { useRef } from "react";

import {
  ChevronsLeftIcon,
  ChevronsRightIcon,
  StarIcon,
  VerifiedIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Store } from "@/db/schema";

interface Props {
  stores: (Pick<Store, "name" | "description" | "slug" | "status"> & {
    productCount: number;
  })[];
}

export function FeaturedStores({ stores }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 330;

      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  }

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 flex space-x-2 md:-top-12">
        <Button variant="outline" size="icon" onClick={() => scroll("left")}>
          <ChevronsLeftIcon className="size-5" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => scroll("right")}>
          <ChevronsRightIcon className="size-5" />
        </Button>
      </div>
      <div
        ref={scrollRef}
        className="scrollbar-hide -mx-4 flex space-x-4 overflow-x-auto px-4 pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {stores.map((store, i) => (
          <Card key={i} className="max-w-[300px] min-w-[300px]">
            <CardHeader className="relative">
              <div className="absolute top-4 right-4">
                {store.status === "active" && (
                  <Badge variant="secondary" className="text-sm font-medium">
                    <VerifiedIcon />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex flex-col items-center text-center">
                <Avatar className="mb-2 h-16 w-16">
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${store.name}`}
                    alt={store.name}
                  />
                  <AvatarFallback>
                    {store.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg">{store.name}</CardTitle>
                <CardDescription className="mt-2 flex items-center text-white">
                  <StarIcon className="mr-1 size-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">0</span>
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground mb-4 flex justify-center text-sm">
                {store.productCount}{" "}
                {store.productCount > 0 ? "Products" : "Product"}
              </div>
              <p className="text-muted-foreground line-clamp-2 text-center text-sm">
                {store.description}
              </p>
            </CardContent>
            <CardFooter className="flex justify-center pt-0">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/stores/${store.slug}`}>View Store</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
