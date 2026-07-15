CREATE TYPE "currency_code" AS ENUM('usd', 'pln', 'eur', 'nok');--> statement-breakpoint
CREATE TYPE "country_code" AS ENUM('pl', 'no');--> statement-breakpoint
CREATE TYPE "customer_type" AS ENUM('individual', 'company', 'government');--> statement-breakpoint
CREATE TABLE "billing_info" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"customer_id" uuid NOT NULL,
	"address" varchar(240) NOT NULL,
	"city" varchar(120) NOT NULL,
	"region" varchar(120),
	"postal_code" varchar(32) NOT NULL,
	"country" "country_code" NOT NULL,
	"due_within_days" integer NOT NULL,
	"currency" "currency_code" NOT NULL,
	CONSTRAINT "billing_info_due_within_days_check" CHECK ("due_within_days" between 0 and 365)
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"customer_id" uuid NOT NULL,
	"name" varchar(120) NOT NULL,
	"email" varchar(320),
	"phone" varchar(32),
	"description" text
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"name" varchar(120) NOT NULL,
	"type" "customer_type" NOT NULL,
	"legal_name" varchar(200),
	"tax_number" varchar(64),
	"address" varchar(240),
	"city" varchar(120),
	"region" varchar(120),
	"postal_code" varchar(32),
	"country" "country_code",
	"notes" text
);
--> statement-breakpoint
CREATE UNIQUE INDEX "billing_info_customer_id_unique" ON "billing_info" ("customer_id");--> statement-breakpoint
CREATE UNIQUE INDEX "contacts_customer_id_unique" ON "contacts" ("customer_id");--> statement-breakpoint
ALTER TABLE "billing_info" ADD CONSTRAINT "billing_info_customer_id_customers_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_customer_id_customers_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE;