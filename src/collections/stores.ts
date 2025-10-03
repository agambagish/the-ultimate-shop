import type { CollectionConfig } from "payload";

export const Stores: CollectionConfig = {
  slug: "stores",
  admin: {
    useAsTitle: "subdomain",
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
      admin: {
        readOnly: true,
      },
    },
    {
      name: "kycDetailsSubmitted",
      type: "checkbox",
      admin: {
        readOnly: true,
        description:
          "You can't create products until you submit your KYC details",
      },
    },
  ],
};
