import {
  decimal,
  index,
  integer,
  json,
  pgEnum,
  pgTable,
  text,
} from "drizzle-orm/pg-core";

export const paymentStatusEnum = pgEnum("payment_status", ["pending", "paid"]);

export const orders = pgTable(
  "orders",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    amount: decimal({ precision: 10, scale: 2 }).notNull().default("0"),
    payuTransactionId: text().notNull().unique(),
    transactionId: text().notNull().unique(),
    name: text().notNull(),
    email: text().notNull(),
    userId: text().notNull(),
    vpa: text().notNull(),
    payer: text().notNull(),
    items: json().$type<{ id: number; qty: number }[]>().default([]),
    deliveryAddress: text().notNull(),
  },
  (table) => ({
    userIdIdx: index().on(table.userId),
    transactionIdIdx: index().on(table.transactionId),
  })
);
