CREATE TYPE "public"."status" AS ENUM('activated', 'pending', 'deactivated');--> statement-breakpoint
ALTER TABLE "stores" RENAME COLUMN "user_id" TO "email";--> statement-breakpoint
ALTER TABLE "stores" DROP CONSTRAINT "stores_userId_unique";--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "status" "status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "stores" ADD CONSTRAINT "stores_email_unique" UNIQUE("email");