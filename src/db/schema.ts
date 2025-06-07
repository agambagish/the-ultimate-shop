import { relations } from "drizzle-orm";
import {
  decimal,
  integer,
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

export const storeStatusEnum = pgEnum("store_status", [
  "active",
  "pending",
  "deactive",
]);

export const users = pgTable("users", {
  clerkId: varchar({ length: 255 }).primaryKey(),
  role: userRoleEnum().notNull().default("user"),
});

export const stores = pgTable("stores", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  slug: text().notNull().unique(),
  avatarUrl: text().notNull(),
  credits: decimal({ precision: 10, scale: 2 }).notNull().default("0"),
  rating: integer().notNull().default(0),
  status: storeStatusEnum().notNull().default("active"),
  addressLine1: varchar({ length: 255 }).notNull(),
  addressLine2: varchar({ length: 255 }),
  city: varchar({ length: 255 }).notNull(),
  state: varchar({ length: 255 }).notNull(),
  country: varchar({ length: 255 }).notNull(),
  pinCode: varchar({ length: 255 }).notNull(),
  userId: varchar({ length: 255 })
    .notNull()
    .references(() => users.clerkId, { onDelete: "cascade" }),
});

export const products = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  longDescription: text().notNull(),
  price: decimal({ precision: 10, scale: 2 }).notNull().default("0"),
  discountPercentage: integer().notNull().default(0),
  imageUrl: text().notNull(),
  fileTypes: json().$type<string[]>().notNull().default([]),
  rating: integer().notNull().default(0),
  storeId: integer()
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const usersRelations = relations(users, ({ one }) => ({
  store: one(stores),
}));

export const storesRelations = relations(stores, ({ one, many }) => ({
  user: one(users, {
    fields: [stores.userId],
    references: [users.clerkId],
  }),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
  store: one(stores, {
    fields: [products.storeId],
    references: [stores.id],
  }),
}));

export type User = typeof users.$inferInsert;
export type Store = typeof stores.$inferSelect;
export type Product = typeof products.$inferSelect;
