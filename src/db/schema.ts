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
  slug: varchar({ length: 255 }).notNull().unique(),
  avatarUrl: text().notNull(),
  credits: decimal({ precision: 10, scale: 2 }).notNull().default("0"),
  rating: integer().notNull().default(0),
  status: storeStatusEnum().notNull().default("active"),
  addressLine1: varchar({ length: 255 }).notNull(),
  addressLine2: varchar({ length: 255 }),
  city: varchar({ length: 255 }).notNull(),
  state: varchar({ length: 255 }).notNull(),
  country: varchar({ length: 255 }).notNull(),
  pinCode: varchar({ length: 20 }).notNull(),
  userId: varchar({ length: 255 }).notNull().unique(),
});

export const products = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
  description: varchar({ length: 500 }).notNull(),
  longDescription: text().notNull(),
  price: decimal({ precision: 10, scale: 2 }).notNull().default("0"),
  discountPercentage: integer().notNull().default(0),
  thumbnailImageURL: text().notNull(),
  imageURL1: text().notNull(),
  imageURL2: text().notNull(),
  imageURL3: text(),
  imageURL4: text(),
  imageURL5: text(),
  fileTypes: json().$type<string[]>().notNull().default([]),
  rating: integer().notNull().default(0),
  productAssetId: integer()
    .notNull()
    .references(() => productsAssets.id, { onDelete: "cascade" }),
  storeId: integer()
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const productsAssets = pgTable("products_assets", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  pinataId: text().notNull().unique(),
  fileName: varchar({ length: 255 }).notNull(),
  mimeType: varchar({ length: 100 }).notNull(),
  size: integer().notNull(),
  productSlug: varchar({ length: 255 }).notNull(),
});

export const orders = pgTable("orders", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar({ length: 255 }).notNull(),
  storeId: integer()
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  totalAmount: decimal({ precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp().defaultNow(),
});

export const ordersItems = pgTable("orders_items", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer()
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productSlug: varchar({ length: 255 })
    .notNull()
    .references(() => products.slug, { onDelete: "cascade" }),
  priceAtPurchase: decimal({ precision: 10, scale: 2 }).notNull(),
});

export const storesRelations = relations(stores, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
  store: one(stores, { fields: [products.storeId], references: [stores.id] }),
  productAsset: one(productsAssets, {
    fields: [products.productAssetId],
    references: [productsAssets.id],
  }),
}));

export const productsAssetsRelations = relations(productsAssets, ({ one }) => ({
  product: one(products, {
    fields: [productsAssets.productSlug],
    references: [products.slug],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  store: one(stores, { fields: [orders.storeId], references: [stores.id] }),
  orderItems: many(ordersItems),
}));

export const ordersItemsRelations = relations(ordersItems, ({ one }) => ({
  order: one(orders, {
    fields: [ordersItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [ordersItems.productSlug],
    references: [products.slug],
  }),
}));

export type User = typeof users.$inferInsert;
export type Store = typeof stores.$inferSelect;
export type Product = typeof products.$inferSelect;
export type ProductAsset = typeof productsAssets.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof ordersItems.$inferSelect;
