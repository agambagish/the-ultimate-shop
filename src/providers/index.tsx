import { Jost } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";

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
        {children}
        <Toaster richColors toastOptions={{ className: font.className }} />
      </ThemeProvider>
    </>
  );
}
