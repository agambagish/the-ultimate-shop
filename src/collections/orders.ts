import type { CollectionConfig } from "payload";

import { isSuperAdmin } from "@/lib/access";

export const Orders: CollectionConfig = {
  slug: "orders",
  access: {
    read: ({ req }) => isSuperAdmin(req.user),
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  fields: [
    {
      name: "price",
      type: "number",
      required: true,
    },
    {
      name: "discountedPrice",
      type: "number",
      required: true,
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
    },
    {
      name: "product",
      type: "relationship",
      relationTo: "products",
      required: true,
      hasMany: false,
    },
    {
      name: "cashfreeOrderId",
      type: "text",
      required: true,
    },
    {
      name: "cashfreePaymentId",
      type: "text",
      required: true,
    },
    {
      name: "paymentDetails",
      type: "blocks",
      required: true,
      blocks: [
        {
          slug: "upi",

          fields: [
            {
              name: "vpa",
              type: "text",
              required: true,
            },
          ],
        },
        {
          slug: "card",
          fields: [
            {
              name: "cardNumber",
              type: "text",
              required: true,
            },
            {
              name: "cardNetwork",
              type: "text",
              required: true,
            },
            {
              name: "cardBankName",
              type: "text",
              required: true,
            },
          ],
        },
      ],
    },
  ],
};
