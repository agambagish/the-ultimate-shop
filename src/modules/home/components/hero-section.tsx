import Link from "next/link";

import { SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroSection() {
  return (
    <section className="flex flex-col items-center py-12 text-center md:py-24 lg:py-32">
      <div className="mx-auto max-w-3xl space-y-4 px-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Discover and Download Premium Digital Assets
        </h1>
        <p className="text-muted-foreground mx-auto max-w-[700px] text-xl">
          The marketplace for high-quality digital products created by top
          designers and developers.
        </p>
        <div className="mx-auto flex w-full max-w-lg flex-col gap-3 pt-4 sm:flex-row">
          <div className="relative flex-grow">
            <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              placeholder="Search digital assets..."
              className="h-10 w-full pl-10"
            />
          </div>
          <Button size="lg">Search</Button>
        </div>
        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/products?category=icons">Icon Packs</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/products?category=ui-kits">UI Kits</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/products?category=templates">Templates</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/products?category=ebooks">eBooks</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/products?category=graphics">Graphics</Link>
          </Button>
        </div>
      </div>
      <div className="mx-auto mt-12 w-full max-w-5xl px-4 md:mt-16">
        <div className="from-primary/10 via-secondary/10 to-accent/10 flex flex-col items-center rounded-xl bg-gradient-to-r p-8">
          <div className="grid w-full grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-muted-foreground">Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">2K+</div>
              <div className="text-muted-foreground">Creators</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">50K+</div>
              <div className="text-muted-foreground">Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">99%</div>
              <div className="text-muted-foreground">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
