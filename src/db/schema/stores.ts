import { integer, pgEnum, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const businessTypeEnum = pgEnum("business_type", [
  "sole_proprietor",
  "llc",
  "corporation",
  "partnership",
  "other",
]);

export const storeCategoryEnum = pgEnum("store_category", ["clothing", "toys"]);

export const stores = pgTable("stores", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  businessName: varchar({ length: 24 }).notNull(),
  businessType: businessTypeEnum().notNull(),
  businessDescription: text().notNull(),
  firstName: text().notNull(),
  lastName: text().notNull(),
  storeName: varchar({ length: 24 }).notNull(),
  storeUrl: text().notNull(),
  storeCategory: storeCategoryEnum().notNull(),
  storeDescription: text().notNull(),
  taxId: varchar({ length: 15 }).notNull(),
  address: text().notNull(),
  country: text().notNull(),
  state: text().notNull(),
  city: text().notNull(),
  zipCode: text().notNull(),
  userId: text().notNull().unique(),
});
