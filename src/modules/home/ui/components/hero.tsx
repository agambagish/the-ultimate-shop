import { SearchBar } from "./search-bar";

export function Hero() {
  return (
    <div className="relative z-10 mt-0 mb-16 lg:mt-12">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-5">
          <div className="space-y-4">
            <h1 className="font-bold text-4xl leading-tight sm:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Premium Digital
              </span>
              <br />
              <span className="text-foreground">Assets & UI Kits</span>
            </h1>
            <p className="max-w-lg text-muted-foreground text-xl">
              Discover thousands of high-quality templates, UI components, and
              digital assets to accelerate your creative projects.
            </p>
          </div>
        </div>
        <div className="space-y-6 lg:col-span-7">
          <SearchBar />
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border/30 bg-white/40 p-4 text-center backdrop-blur-sm">
              <div className="font-bold text-2xl text-primary">1000+</div>
              <div className="text-muted-foreground text-sm">Products</div>
            </div>
            <div className="rounded-2xl border border-border/30 bg-white/40 p-4 text-center backdrop-blur-sm">
              <div className="font-bold text-2xl text-primary">50k+</div>
              <div className="text-muted-foreground text-sm">Downloads</div>
            </div>
            <div className="rounded-2xl border border-border/30 bg-white/40 p-4 text-center backdrop-blur-sm">
              <div className="font-bold text-2xl text-primary">4.9</div>
              <div className="text-muted-foreground text-sm">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
