import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Loader2Icon } from "lucide-react";

import { Footer } from "@/modules/layout/components/footer";
import { Navbar } from "@/modules/layout/components/navbar";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <main>
      <Navbar />
      <div className="flex h-[calc(100vh-4.5rem)] items-center justify-center">
        <ClerkLoading>
          <Loader2Icon className="text-muted-foreground size-8 animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>{children}</ClerkLoaded>
      </div>
      <Footer />
    </main>
  );
}
