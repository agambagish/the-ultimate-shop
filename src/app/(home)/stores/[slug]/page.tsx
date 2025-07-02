import { notFound } from "next/navigation";

import { MapPinIcon, StarIcon, VerifiedIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStore } from "@/modules/store/server/get-store";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: Props) {
  const _params = await params;
  const store = await getStore(_params.slug);

  if (!store) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:py-8">
      <div className="relative">
        <div className="from-primary/10 to-secondary/10 h-48 w-full rounded-lg bg-gradient-to-r sm:h-64" />
        <div className="relative -mt-12 items-end px-4 sm:-mt-16 sm:flex sm:px-6">
          <Avatar className="border-background h-24 w-24 border-4 sm:h-32 sm:w-32">
            <AvatarImage
              src={`https://avatar.vercel.sh/${store.name}`}
              alt={store.name}
            />
            <AvatarFallback>
              {store.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="mt-4 sm:mt-0 sm:ml-6 sm:flex-1">
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-end">
              <div>
                <h1 className="text-3xl font-bold">{store.name}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <div className="flex items-center">
                    <StarIcon className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">0</span>
                    <span className="text-muted-foreground ml-1 text-sm">
                      (0 reviews)
                    </span>
                  </div>
                  {store.status === "active" && (
                    <Badge variant="secondary" className="font-medium">
                      <VerifiedIcon />
                      Verified Seller
                    </Badge>
                  )}
                  <div className="text-muted-foreground flex items-center text-sm">
                    <MapPinIcon className="mr-1 h-4 w-4" />
                    {store.city}, {store.state}, {store.country}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-3 sm:mt-0">
                <Button>Follow</Button>
                <Button variant="outline">Contact</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <Tabs defaultValue="products">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="products">
              Products ({store.productCount})
            </TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="products" className="mt-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {/* {store.products.map((product, i) => (
                <ProductCard
                  key={i}
                  product={{
                    ...product,
                    storeName: store.name,
                    storeSlug: store.slug,
                  }}
                />
              ))} */}
              Products here
            </div>
          </TabsContent>
          <TabsContent value="about" className="mt-6 max-w-3xl">
            <div className="prose">
              <h2>About {store.name}</h2>
              <p>{store.description}</p>
              <h3 className="mt-6">Contact Information</h3>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            Store Reviews
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
