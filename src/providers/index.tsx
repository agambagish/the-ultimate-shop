import { Jost } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";

import { EdgeStoreProvider } from "./edgestore-provider";
import { ThemeProvider } from "./theme-provider";

const font = Jost({ subsets: ["latin"] });

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <EdgeStoreProvider>{children}</EdgeStoreProvider>
        <Toaster richColors toastOptions={{ className: font.className }} />
      </ThemeProvider>
    </>
  );
}
