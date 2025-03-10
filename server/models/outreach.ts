import { 
  mysqlTable,
  serial,
  text,
  int
} from 'drizzle-orm/mysql-core';
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { teamMembers } from './team';

export const outreach = mysqlTable('outreach', {
  id: serial('id').primaryKey(),
  leadName: text('lead_name').notNull(),
  channel: text('channel').notNull(), // LinkedIn, Email, WhatsApp, Job Boards, Staff Augmentation
  stage: text('stage').notNull(), // Lead Identified, Contacted, Engaged, Proposal Sent, Closed
  addedById: int('added_by_id').notNull().references(() => teamMembers.id),
  notes: text('notes'),
});

export const insertOutreachSchema = createInsertSchema(outreach);
export type Outreach = typeof outreach.$inferSelect;
export type InsertOutreach = z.infer<typeof insertOutreachSchema>;
