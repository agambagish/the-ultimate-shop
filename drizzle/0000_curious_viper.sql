CREATE TYPE "public"."business_type" AS ENUM('sole_proprietor', 'llc', 'corporation', 'partnership', 'other');--> statement-breakpoint
CREATE TYPE "public"."store_category" AS ENUM('clothing', 'toys');--> statement-breakpoint
CREATE TABLE "stores" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "stores_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"business_name" varchar(24) NOT NULL,
	"business_type" "business_type" NOT NULL,
	"business_description" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"store_name" varchar(24) NOT NULL,
	"store_url" text NOT NULL,
	"store_category" "store_category" NOT NULL,
	"store_description" text NOT NULL,
	"tax_id" varchar(15) NOT NULL,
	"address" text NOT NULL,
	"country" text NOT NULL,
	"state" text NOT NULL,
	"city" text NOT NULL,
	"zip_code" text NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "stores_userId_unique" UNIQUE("user_id")
);
