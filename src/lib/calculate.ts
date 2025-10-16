import type { Product } from "@/payload-types";

export function calculatePricing(data: Product[]) {
  const subtotal = Math.round(
    data.reduce((acc, product) => acc + product.price, 0),
  );

  const totalSavings = Math.round(
    data.reduce((acc, product) => {
      const savings =
        product.discountType === "percentage"
          ? (product.price * product.discountValue) / 100
          : product.discountValue;

      return acc + Math.min(savings, product.price);
    }, 0),
  );

  const total =
    totalSavings > 0 ? Math.round(subtotal - totalSavings) : subtotal;

  return {
    subtotal,
    totalSavings,
    total,
  };
}
