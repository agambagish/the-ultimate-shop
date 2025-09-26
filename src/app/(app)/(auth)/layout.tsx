import { Check } from "lucide-react";

import { Header } from "@/modules/auth/ui/components/header";
import { Footer } from "@/modules/home/ui/components/footer";

export default function ({ children }: React.PropsWithChildren) {
  return (
    <main>
      <Header />
      <div className="flex min-h-screen">
        <div className="relative hidden overflow-hidden lg:flex lg:w-1/2">
          <div className="relative z-10 flex flex-col justify-center px-12 py-16">
            <div className="space-y-6">
              <h1 className="font-bold text-4xl leading-tight">
                Start your creative
                <span className="block text-muted-foreground">
                  journey today
                </span>
              </h1>
              <p className="text-muted-foreground text-xl leading-relaxed">
                Join thousands of creators who trust TUS for premium digital
                assets. Build your store and access our curated marketplace of
                UI kits, templates, and more.
              </p>
              <div className="space-y-4 pt-8">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-muted-foreground">
                    Access to 1000+ premium assets
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <Check className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-muted-foreground">
                    Your own personalized store
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                    <Check className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-muted-foreground">
                    Commercial licensing included
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
          {children}
        </div>
      </div>
      <Footer />
    </main>
  );
}
