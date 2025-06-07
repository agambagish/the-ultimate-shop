import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Loader2Icon } from "lucide-react";

import { Footer } from "@/modules/home/ui/components/footer";
import { Navbar } from "@/modules/home/ui/components/navbar";

interface Props {
  children: React.ReactNode;
}

export function AuthLayout({ children }: Props) {
  return (
    <main>
      <Navbar isStoreOwner />
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
