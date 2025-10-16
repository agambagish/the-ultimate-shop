import type { CollectionConfig, NumberFieldSingleValidation } from "payload";

import { isSeller, isSuperAdmin } from "@/lib/access";
import type { Product, Store } from "@/payload-types";

export const Products: CollectionConfig = {
  slug: "products",
  access: {
    create: ({ req }) => {
      if (isSuperAdmin(req.user)) return true;

      const tenant = req.user?.tenants?.[0]?.tenant as Store;
      return Boolean(tenant?.kycDetailsSubmitted);
    },
  },
  admin: {
    useAsTitle: "title",
    hidden: ({ user }) => {
      if (isSuperAdmin(user)) return false;
      return !isSeller(user);
    },
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "text",
    },
    {
      name: "price",
      label: "Price (₹)",
      type: "number",
      required: true,
      admin: {
        description: "in Indian National Rupee (INR)",
      },
    },
    {
      name: "discountType",
      type: "radio",
      options: [
        { label: "Flat", value: "flat" },
        { label: "Percentage", value: "percentage" },
      ],
      defaultValue: "flat",
      required: true,
    },
    {
      name: "discountValue",
      type: "number",
      defaultValue: 0,
      min: 0,
      validate: ((
        value,
        { siblingData }: { siblingData: Partial<Product> },
      ) => {
        const discountType = siblingData.discountType;
        const price = siblingData.price;

        if (typeof value !== "number" || value < 0) {
          return "Discount must be a positive number.";
        }

        if (discountType === "percentage") {
          if (value > 100) {
            return "Percentage discount cannot exceed 100%.";
          }
          if (price != null && value > 0 && (value / 100) * price > price) {
            return "Discount cannot exceed product price.";
          }
        }

        if (discountType === "flat") {
          if (price != null && value > price) {
            return "Flat discount cannot exceed product price.";
          }
        }

        return true;
      }) as NumberFieldSingleValidation,
      required: true,
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      hasMany: false,
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "content",
      type: "textarea",
      admin: {
        description:
          "This is protected content (only visible to customers after purchase). You can add product documentation, downloadable files, getting started guides & bonus materials. Supports Markdown formatting",
      },
    },
  ],
};
