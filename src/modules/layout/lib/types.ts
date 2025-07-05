import type { Product } from "@/db/schema";

export type CartItem = Pick<
  Product,
  "title" | "slug" | "price" | "discountPercentage" | "thumbnailImageURL"
> & {
  category: string;
  storeId: number;
};
