import Link from "next/link";

import { ArrowRight, Palette, Shield, Sparkles, Zap } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="space-y-12 text-center">
          <div className="inline-flex items-center space-x-2 rounded-full border border-border/40 bg-white/60 px-6 py-3 shadow-lg backdrop-blur-sm">
            <Palette className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground text-sm">
              The Ultimate Digital Marketplace
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
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
            <div className="group rounded-2xl border border-border/30 bg-white/40 p-8 text-center backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/60 hover:shadow-xl">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 transition-transform group-hover:scale-110">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground text-xl">
                Instant Access
              </h3>
              <p className="text-muted-foreground">
                Download immediately after purchase with unlimited access to
                your library
              </p>
            </div>
            <div className="group rounded-2xl border border-border/30 bg-white/40 p-8 text-center backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/60 hover:shadow-xl">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-400/10 transition-transform group-hover:scale-110">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground text-xl">
                Commercial License
              </h3>
              <p className="text-muted-foreground">
                Use in client projects and commercial applications without
                restrictions
              </p>
            </div>
            <div className="group rounded-2xl border border-border/30 bg-white/40 p-8 text-center backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/60 hover:shadow-xl">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500/20 to-green-400/10 transition-transform group-hover:scale-110">
                <Sparkles className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground text-xl">
                Premium Quality
              </h3>
              <p className="text-muted-foreground">
                Handpicked assets from top designers with rigorous quality
                standards
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="#products"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-2xl bg-gradient-to-r from-primary via-primary/90 to-primary/80 px-8 py-4 font-semibold text-lg text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 hover:shadow-primary/25",
                )}
              >
                Explore Collection
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/pricing"
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    size: "lg",
                  }),
                  "rounded-2xl border-border/40 bg-white/60 px-8 py-4 font-semibold text-lg shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/80",
                )}
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
    </section>
  );
}
