import type { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",
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
  ],
};
