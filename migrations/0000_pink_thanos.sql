CREATE TABLE "bids" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_title" text NOT NULL,
	"job_link" text NOT NULL,
	"bid_amount" integer NOT NULL,
	"status" text NOT NULL,
	"submission_date" timestamp DEFAULT now() NOT NULL,
	"added_by_id" integer NOT NULL,
	"proposal_notes" text
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"company" text NOT NULL,
	"contact_info" text NOT NULL,
	"source" text NOT NULL,
	"status" text NOT NULL,
	"added_by_id" integer NOT NULL,
	"last_activity" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "outreach" (
	"id" serial PRIMARY KEY NOT NULL,
	"lead_name" text NOT NULL,
	"channel" text NOT NULL,
	"stage" text NOT NULL,
	"added_by_id" integer NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"added_by_id" integer NOT NULL,
	"due_date" timestamp NOT NULL,
	"completed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"target" integer NOT NULL,
	"target_clients" integer DEFAULT 2 NOT NULL
);
