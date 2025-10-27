"use client";

import { Suspense, useEffect } from "react";

import confetti from "canvas-confetti";

import { useLibraryStates } from "../../hooks/use-library-states";
import {
  PurchasedProductList,
  PurchasedProductListSkeleton,
} from "../components/purchased-product-list";

export function LibraryView() {
  function handleConfetti() {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;
    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  }

  const [states, setStates] = useLibraryStates();

  // biome-ignore lint/correctness/useExhaustiveDependencies: _
  useEffect(() => {
    if (states.success) {
      setStates({ success: false });
      handleConfetti();
    }
  }, [states.success, setStates]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col">
        <h1 className="mb-2 font-bold text-3xl lg:text-4xl">Your Library</h1>
        <p className="text-lg text-muted-foreground lg:text-xl">
          Access and manage your purchased digital assets
        </p>
      </div>
      <Suspense fallback={<PurchasedProductListSkeleton />}>
        <PurchasedProductList />
      </Suspense>
    </div>
  );
}
