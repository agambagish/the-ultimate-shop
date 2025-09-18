import type { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  fields: [
    {
      name: "label",
      type: "text",
      required: true,
    },
  ],
};
