CREATE TYPE "product_ownership" AS ENUM('by_client', 'rented');--> statement-breakpoint
CREATE TYPE "work_order_stage" AS ENUM('waiting', 'diagnostics', 'waiting-parts', 'repaired');--> statement-breakpoint
CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"name" varchar(120) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "extra_expenses" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"work_order_id" uuid NOT NULL,
	"name" varchar(200) NOT NULL,
	"price" numeric(12,2) NOT NULL,
	"is_hidden" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_categories" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"name" varchar(120) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_types" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"category_id" uuid NOT NULL,
	"name" varchar(120) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"company_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"type_id" uuid NOT NULL,
	"manufacturer" varchar(120) NOT NULL,
	"model" varchar(120) NOT NULL,
	"serial_number" varchar(120) NOT NULL,
	"address" varchar(240),
	"contact_name" varchar(120),
	"warranty_date" date,
	"ownership" "product_ownership" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"company_id" uuid NOT NULL,
	"email" varchar(320) NOT NULL,
	"password_hash" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "work_order_history_items" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"work_order_id" uuid NOT NULL,
	"worker_id" uuid,
	"text" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "work_orders" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"company_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"product_id" uuid,
	"worker_id" uuid,
	"number" integer NOT NULL,
	"description" text NOT NULL,
	"stage" "work_order_stage" DEFAULT 'waiting'::"work_order_stage" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"estimated_date" date,
	"show_final_price" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
DROP TABLE "billing_info";--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "company_id" uuid NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "companies_name_unique" ON "companies" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "users_company_id_email_unique" ON "users" ("company_id","email");--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_company_id_companies_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "extra_expenses" ADD CONSTRAINT "extra_expenses_work_order_id_work_orders_id_fkey" FOREIGN KEY ("work_order_id") REFERENCES "work_orders"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "product_types" ADD CONSTRAINT "product_types_category_id_product_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_company_id_companies_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_customer_id_customers_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_type_id_product_types_id_fkey" FOREIGN KEY ("type_id") REFERENCES "product_types"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_company_id_companies_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "work_order_history_items" ADD CONSTRAINT "work_order_history_items_work_order_id_work_orders_id_fkey" FOREIGN KEY ("work_order_id") REFERENCES "work_orders"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "work_order_history_items" ADD CONSTRAINT "work_order_history_items_worker_id_users_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_company_id_companies_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_customer_id_customers_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_worker_id_users_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
DROP TYPE "currency_code";