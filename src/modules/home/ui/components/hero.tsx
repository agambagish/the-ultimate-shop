import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <div className="relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="space-y-12 text-center">
          <div className="inline-flex items-center rounded-full border border-border/40 bg-white/60 px-6 py-3 shadow-lg backdrop-blur-sm">
            <span className="font-semibold text-foreground text-sm">
              🎨 The Ultimate Digital Marketplace
            </span>
          </div>
          <div className="space-y-6">
            <h1 className="font-bold text-5xl leading-tight tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
              <span className="block bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                Premium Digital
              </span>
              <span className="mt-2 block text-foreground">
                Assets & UI Kits
              </span>
            </h1>
            <p className="mx-auto max-w-4xl text-muted-foreground text-xl leading-relaxed sm:text-2xl lg:text-3xl">
              Discover thousands of high-quality templates, UI components, and
              digital assets crafted by world-class designers to accelerate your
              creative projects.
            </p>
          </div>
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/products"
                className={cn(buttonVariants({ size: "lg" }), "shiny-button")}
              >
                Explore Collection
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/pricing"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                })}
              >
                View Pricing
              </Link>
            </div>
            <p className="text-muted-foreground text-sm">
              Join 50,000+ designers and developers who trust TUS for their
              creative projects
            </p>
          </div>
          <div className="border-border/20 border-t pt-12">
            <div className="grid grid-cols-2 items-center gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="font-bold text-3xl text-primary">1000+</div>
                <div className="text-muted-foreground text-sm">
                  Premium Assets
                </div>
              </div>
              <div className="text-center">
                <div className="font-bold text-3xl text-primary">50k+</div>
                <div className="text-muted-foreground text-sm">
                  Happy Customers
                </div>
              </div>
              <div className="text-center">
                <div className="font-bold text-3xl text-primary">4.9★</div>
                <div className="text-muted-foreground text-sm">
                  Average Rating
                </div>
              </div>
              <div className="text-center">
                <div className="font-bold text-3xl text-primary">24/7</div>
                <div className="text-muted-foreground text-sm">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
