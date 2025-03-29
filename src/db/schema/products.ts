import { relations } from "drizzle-orm";
import {
  decimal,
  index,
  integer,
  json,
  pgEnum,
  pgTable,
  text,
} from "drizzle-orm/pg-core";

import { stores } from "./stores";

export const productStatusEnum = pgEnum("product_status", [
  "active",
  "draft",
  "archived",
]);

export const products = pgTable(
  "products",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: text().notNull(),
    description: text().notNull(),
    images: json().$type<string[]>().notNull().default([]),
    price: decimal({ precision: 10, scale: 2 }).notNull().default("0"),
    inventory: integer().notNull().default(0),
    status: productStatusEnum().notNull().default("draft"),
    storeId: integer()
      .references(() => stores.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => ({
    storeIdIdx: index("products_store_id_idx").on(t.storeId),
  })
);

export const productsRelations = relations(products, ({ one }) => ({
  store: one(stores, { fields: [products.storeId], references: [stores.id] }),
}));
