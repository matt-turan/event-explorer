CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"ticketmaster_id" varchar(255) NOT NULL,
	"name" varchar(500) NOT NULL,
	"description" text,
	"start_date" timestamp NOT NULL,
	"venue" varchar(500),
	"city" varchar(255),
	"country" varchar(255),
	"image_url" varchar(1000),
	"url" varchar(1000),
	"min_price" numeric(10, 2),
	"max_price" numeric(10, 2),
	"category" varchar(255),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "events_ticketmaster_id_unique" UNIQUE("ticketmaster_id")
);
--> statement-breakpoint
CREATE TABLE "saved_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"ticketmaster_id" varchar(255) NOT NULL,
	"name" varchar(500) NOT NULL,
	"start_date" timestamp NOT NULL,
	"venue" varchar(500),
	"city" varchar(255),
	"image_url" varchar(1000),
	"url" varchar(1000),
	"category" varchar(255),
	"saved_at" timestamp DEFAULT now()
);
