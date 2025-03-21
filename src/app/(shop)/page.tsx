"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center space-y-4">
      <p className="text-2xl font-bold">🚀 Hello World!</p>
      <Button
        size="sm"
        onClick={() => {
          toast.info("Clicked!");
        }}
      >
        Click Me!
      </Button>
    </main>
  );
}
