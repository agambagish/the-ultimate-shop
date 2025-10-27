import type { products } from "@/generated/prisma";
import { Decimal } from "@/generated/prisma/runtime/index-browser";

function toNum(value: number | Decimal): number {
  return value instanceof Decimal ? value.toNumber() : value;
}

export function calculateTotals(
  products: Pick<products, "price" | "discount_type" | "discount_value">[],
) {
  const subtotal = products.reduce(
    (acc, product) => acc + product.price.toNumber(),
    0,
  );

  const totalSavings = products.reduce((acc, product) => {
    const savings =
      product.discount_type === "percentage"
        ? (product.price.toNumber() * product.discount_value.toNumber()) / 100
        : product.discount_value.toNumber();

    return acc + Math.min(savings, product.price.toNumber());
  }, 0);

  const total = totalSavings > 0 ? subtotal - totalSavings : subtotal;

  return {
    subtotal: Math.round(subtotal),
    totalSavings: Math.round(totalSavings),
    total: Math.round(total),
  };
}

export function calculateProductPricing(
  product: Pick<products, "discount_type"> & {
    price: number | Decimal;
    discount_value: number | Decimal;
  },
) {
  const price = toNum(product.price);
  const discount_value = toNum(product.discount_value);

  const discountPercentage =
    product.discount_type === "percentage"
      ? discount_value
      : (discount_value / price) * 100;

  const discountedPrice =
    product.discount_type === "flat"
      ? price - discount_value
      : price - (price * discount_value) / 100;

  const originalPrice = discount_value > 0 ? Math.round(price) : null;

  return {
    discountPercentage: Math.round(discountPercentage),
    discountedPrice: Math.round(discountedPrice),
    originalPrice,
  };
}
