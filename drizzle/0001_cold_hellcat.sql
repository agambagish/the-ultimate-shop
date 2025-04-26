CREATE TYPE "public"."payment_status" AS ENUM('pending', 'paid');--> statement-breakpoint
CREATE TABLE "orders" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "orders_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"amount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"payu_transaction_id" text NOT NULL,
	"transaction_id" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"user_id" text NOT NULL,
	"vpa" text NOT NULL,
	"payer" text NOT NULL,
	"items" json DEFAULT '[]'::json,
	"delivery_address" text NOT NULL,
	CONSTRAINT "orders_payuTransactionId_unique" UNIQUE("payu_transaction_id"),
	CONSTRAINT "orders_transactionId_unique" UNIQUE("transaction_id")
);
--> statement-breakpoint
CREATE INDEX "orders_user_id_index" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "orders_transaction_id_index" ON "orders" USING btree ("transaction_id");