import { 
  mysqlTable,
  serial,
  text,
  int,
  timestamp 
} from 'drizzle-orm/mysql-core';
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { teamMembers } from './team';

export const leads = mysqlTable('leads', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  company: text('company').notNull(),
  contactInfo: text('contact_info').notNull(),
  source: text('source').notNull(),
  status: text('status').notNull(), // New, Contacted, In Progress, Won, Lost
  addedById: int('added_by_id').notNull().references(() => teamMembers.id),
  lastActivity: timestamp('last_activity').notNull().defaultNow(),
});

export const insertLeadSchema = createInsertSchema(leads);
export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
