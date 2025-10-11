import { tenantsArrayField } from "@payloadcms/plugin-multi-tenant/fields";
import type { CollectionConfig } from "payload";

import { isSuperAdmin } from "@/lib/access";

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
      name: "subdomain",
      required: true,
      unique: true,
      type: "text",
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
    },
    {
      admin: {
        position: "sidebar",
      },
      name: "roles",
      type: "select",
      options: ["user", "super_admin"],
      defaultValue: ["user"],
      hasMany: true,
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
