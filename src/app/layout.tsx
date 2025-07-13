import type { Metadata } from "next";
import { Jost } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";

import { siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Providers } from "@/providers";

import "./globals.css";

const font = Jost({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Next.js",
    "Tailwind CSS",
    "Clerk",
    "Drizzle",
    "Shadcn UI",
    "Edgestore",
    "Pinata",
    "PayU",
  ],
  authors: [
    {
      name: "agambagish",
      url: siteConfig.links.github,
    },
  ],
  creator: "agambagish",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.jpg`],
    creator: "@MacherJholBhaat",
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
};

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn("antialiased", font.className)}
          suppressHydrationWarning
        >
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
