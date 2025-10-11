import type { CollectionConfig } from "payload";

import { isSuperAdmin } from "@/lib/access";

export const Stores: CollectionConfig = {
  slug: "stores",
  access: {
    create: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  admin: {
    useAsTitle: "subdomain",
    hidden: ({ user }) => !isSuperAdmin(user),
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Store Name",
      admin: {
        description: "This is the name of the store (e.g. Akash's Store)",
      },
    },
    {
      name: "subdomain",
      type: "text",
      index: true,
      required: true,
      unique: true,
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
      admin: {
        description:
          "This is the subdomain for the store (e.g. [subdomain].tus.in)",
      },
    },
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "cashfreeVendorId",
      type: "text",
      required: true,
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
      admin: {
        description: "Cashfree Easy Split vendor ID associated with your store",
      },
    },
    {
      name: "kycDetailsSubmitted",
      type: "checkbox",
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
      admin: {
        description:
          "You can't create products until you submit your KYC details",
      },
    },
  ],
};
