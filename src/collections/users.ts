import { tenantsArrayField } from "@payloadcms/plugin-multi-tenant/fields";
import type { CollectionConfig } from "payload";

import { isSeller, isSuperAdmin } from "@/lib/access";

const defaultTenantsArrayField = tenantsArrayField({
  tenantsCollectionSlug: "stores",
  arrayFieldAccess: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
  },
  tenantFieldAccess: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
  },
});

export const Users: CollectionConfig = {
  slug: "users",
  access: {
    admin: ({ req }) => isSeller(req.user) || isSuperAdmin(req.user),
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
    update: ({ req, id }) => {
      if (isSuperAdmin(req.user)) return true;
      return req.user?.id === id;
    },
  },
  admin: {
    useAsTitle: "email",
    hidden: ({ user }) => !isSuperAdmin(user),
  },
  auth: true,
  fields: [
    {
      name: "fullname",
      label: "Full Name",
      required: true,
      type: "text",
      access: {
        update: ({ req, id }) => {
          if (isSuperAdmin(req.user)) return true;
          return req.user?.id === id;
        },
      },
    },
    {
      admin: {
        position: "sidebar",
      },
      name: "role",
      type: "radio",
      options: [
        { label: "User", value: "user" },
        { label: "Seller", value: "seller" },
        { label: "Super Admin", value: "super_admin" },
      ],
      defaultValue: "user",
      required: true,
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
    },
    {
      ...defaultTenantsArrayField,
      admin: {
        ...(defaultTenantsArrayField?.admin || {}),
        position: "sidebar",
      },
    },
  ],
};
