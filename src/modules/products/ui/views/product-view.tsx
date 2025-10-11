"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Download,
  Heart,
  Share2,
  Shield,
  Users,
} from "lucide-react";

import { StarRating } from "@/components/star-rating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

const CartButton = dynamic(
  () => import("../components/cart-button").then((mod) => mod.CartButton),
  {
    ssr: false,
    loading: () => <Skeleton className="h-14 w-full" />,
  },
);

interface Props {
  productId: string;
  storeSubdomain: string;
}

export function ProductView({ productId, storeSubdomain }: Props) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({
      id: productId,
    }),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {data.category && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/${data.category.slug}`}>
                    {data.category.label}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}
          <BreadcrumbItem>
            <BreadcrumbPage>{data.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Button variant="link" className="mb-8 cursor-pointer">
        <ArrowLeft />
        Back to products
      </Button>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <Card className="overflow-hidden border-border/40 bg-white/70 shadow-lg backdrop-blur-sm">
            <div className="group relative aspect-video">
              <Image
                src={data.image?.url || "/placeholder.png"}
                alt={data.title}
                className="h-full w-full object-cover"
                fill
              />
            </div>
          </Card>
          <Card className="border-border/40 bg-white/70 shadow-lg backdrop-blur-sm">
            <div className="px-6">
              {data.description ? (
                <p>{data.description}</p>
              ) : (
                <p className="font-medium text-muted-foreground italic">
                  No description provided
                </p>
              )}
            </div>
          </Card>
        </div>
        <div className="space-y-6 lg:col-span-5">
          <Card className="border-border/40 bg-white/70 shadow-lg backdrop-blur-sm">
            <CardContent className="p-8 py-0">
              <div className="space-y-6">
                <h1 className="font-bold text-3xl leading-tight">
                  {data.title}
                </h1>
                <StarRating
                  reviewRating={data.reviewRating}
                  reviewCount={data.reviewCount}
                />
                <div className="flex items-baseline space-x-2">
                  <span className="font-bold text-4xl">
                    {formatCurrency(data.price)}
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatCurrency(Math.round(data.price * 1.4))}
                  </span>
                  <Badge className="bg-green-100 text-green-800">30% OFF</Badge>
                </div>
                <div className="flex items-center space-x-3 rounded-xl bg-muted/60 p-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={data.tenant.avatar?.url || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {data.tenant.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">
                      {data.tenant.name}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Wellness Creator
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <CartButton
                    isPurchased={data.isPurchased}
                    storeSubdomain={storeSubdomain}
                    productId={productId}
                  />
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      className="h-12 flex-1 border-border/40 bg-white/60 backdrop-blur-sm hover:bg-white/80"
                    >
                      <Heart />
                      Wishlist
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12 flex-1 border-border/40 bg-white/60 backdrop-blur-sm hover:bg-white/80"
                    >
                      <Share2 />
                      Share
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-3 rounded-xl border border-green-200 bg-green-50 p-4">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">
                      30-day money-back guarantee
                    </p>
                    <p className="text-green-600 text-sm">
                      Not satisfied? Get a full refund.
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">
                    Key Features
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-muted-foreground text-sm">
                        10 min sessions
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span className="text-muted-foreground text-sm">
                        Instant download
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span className="text-muted-foreground text-sm">
                        All skill levels
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-muted-foreground text-sm">
                        Lifetime access
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-white/70 shadow-lg backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center space-x-3">
                  <div className="flex w-14 items-center">
                    <span className="font-medium text-sm">
                      {stars} {stars === 1 ? "star" : "stars"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <Progress
                      value={data.ratingDistribution[stars]}
                      className="h-2"
                    />
                  </div>
                  <span className="w-12 text-right text-muted-foreground text-sm">
                    {data.ratingDistribution[stars]}%
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
