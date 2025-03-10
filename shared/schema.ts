import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Team members table for referencing in other tables
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(), // 'upwork' or 'direct'
  target: integer("target").notNull(),
  targetClients: integer("target_clients").notNull().default(2),
});

// Leads table
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company").notNull(),
  contactInfo: text("contact_info").notNull(),
  source: text("source").notNull(),
  status: text("status").notNull(), // New, Contacted, In Progress, Won, Lost
  addedById: integer("added_by_id").notNull(),
  lastActivity: timestamp("last_activity").notNull().defaultNow(),
});

// Tasks table
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  addedById: integer("added_by_id").notNull(),
  dueDate: timestamp("due_date").notNull(),
  completed: boolean("completed").notNull().default(false),
});

// Bids table (Upwork)
export const bids = pgTable("bids", {
  id: serial("id").primaryKey(),
  jobTitle: text("job_title").notNull(),
  jobLink: text("job_link").notNull(),
  bidAmount: integer("bid_amount").notNull(),
  status: text("status").notNull(), // Draft, Submitted, Shortlisted, Hired, Lost
  submissionDate: timestamp("submission_date").notNull().defaultNow(),
  addedById: integer("added_by_id").notNull(),
  proposalNotes: text("proposal_notes"),
});

// Outreach table
export const outreach = pgTable("outreach", {
  id: serial("id").primaryKey(),
  leadName: text("lead_name").notNull(),
  channel: text("channel").notNull(), // LinkedIn, Email, WhatsApp, Job Boards, Staff Augmentation
  stage: text("stage").notNull(), // Lead Identified, Contacted, Engaged, Proposal Sent, Closed
  addedById: integer("added_by_id").notNull(),
  notes: text("notes"),
});

// Insert schemas
export const insertTeamMemberSchema = createInsertSchema(teamMembers);

// Custom insert schemas with proper date handling
export const insertLeadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().min(1, "Company name is required"),
  contactInfo: z.string().min(1, "Contact information is required"),
  source: z.string().min(1, "Source is required"),
  status: z.string().min(1, "Status is required"),
  addedById: z.number().min(1, "Team member must be assigned"),
  lastActivity: z.date().default(() => new Date()),
});

export const insertTaskSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  addedById: z.number().min(1, "Team member must be assigned"),
  dueDate: z.date(),
  completed: z.boolean().default(false),
});

export const insertBidSchema = createInsertSchema(bids);
export const insertOutreachSchema = createInsertSchema(outreach);

// Types
export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;

export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type Bid = typeof bids.$inferSelect;
export type InsertBid = z.infer<typeof insertBidSchema>;

export type Outreach = typeof outreach.$inferSelect;
export type InsertOutreach = z.infer<typeof insertOutreachSchema>;