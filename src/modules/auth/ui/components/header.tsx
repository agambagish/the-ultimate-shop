"use client";

import { useRouter } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Header() {
  const router = useRouter();

  function handleClick() {
    router.back();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-border/40 border-b bg-white/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClick}
              className="cursor-pointer"
            >
              <ArrowLeft />
              Back
            </Button>
          </div>
          <div className="-translate-x-1/2 absolute left-1/2 transform">
            <h1 className="whitespace-nowrap font-bold text-xl sm:text-2xl">
              The Ultimate Shop
            </h1>
          </div>
          <div className="w-16 flex-shrink-0 sm:w-20" />
        </div>
      </div>
    </header>
  );
}
