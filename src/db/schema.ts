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

export const storeStatusEnum = pgEnum("store_status", [
  "active",
  "pending",
  "deactive",
]);

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
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Store = typeof stores.$inferSelect;
export type Product = typeof products.$inferSelect;
