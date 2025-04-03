import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";
import { NuqsAdapter as NuqsProvider } from "nuqs/adapters/next/app";

import { Toaster } from "@/components/ui/sonner";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { cn } from "@/lib/utils";

import "./globals.css";

const font = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "The Ultimate Shop",
    template: "%s | The Ultimate Shop",
  },
  description:
    "Ultimate building block of your E-commerce project made with latest web technologies like Next.js, Shadcn UI, Drizzle ORM, Tailwind CSS",
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "Shadcn UI",
    "Building block",
    "E-commerce",
    "Project",
  ],
  authors: [
    {
      name: "agambagish",
      url: "https://github.com/agambagish",
    },
  ],
  creator: "agambagish",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://the-ultimate-shop.vercel.app",
    title: "The Ultimate Shop",
    description:
      "Ultimate building block of your E-commerce project made with latest web technologies like Next.js, Shadcn UI, Drizzle ORM, Tailwind CSS",
    siteName: "The Ultimate Shop",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Ultimate Shop",
    description:
      "Ultimate building block of your E-commerce project made with latest web technologies like Next.js, Shadcn UI, Drizzle ORM, Tailwind CSS",
    images: ["https://the-ultimate-shop.vercel.app/og.jpg"],
    creator: "@MacherJholBhaat",
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "https://the-ultimate-shop.vercel.app/site.webmanifest",
};

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={cn("antialiased", font.className)}>
          <EdgeStoreProvider>
            <NuqsProvider>{children}</NuqsProvider>
          </EdgeStoreProvider>
          <Toaster
            toastOptions={{ className: font.className }}
            theme="light"
            richColors
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
