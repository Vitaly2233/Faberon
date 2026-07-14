CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY,
	"name" varchar(120) NOT NULL,
	"email" varchar(320) NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "customers_email_unique" ON "customers" ("email");