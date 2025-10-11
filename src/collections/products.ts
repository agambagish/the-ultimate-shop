import type { CollectionConfig } from "payload";

import { isSuperAdmin } from "@/lib/access";
import type { Store } from "@/payload-types";

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
