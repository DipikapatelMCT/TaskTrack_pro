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

export const bids = mysqlTable('bids', {
  id: serial('id').primaryKey(),
  jobTitle: text('job_title').notNull(),
  jobLink: text('job_link').notNull(),
  bidAmount: int('bid_amount').notNull(),
  status: text('status').notNull(), // Draft, Submitted, Shortlisted, Hired, Lost
  submissionDate: timestamp('submission_date').notNull().defaultNow(),
  addedById: int('added_by_id').notNull().references(() => teamMembers.id),
  proposalNotes: text('proposal_notes'),
});

export const insertBidSchema = createInsertSchema(bids);
export type Bid = typeof bids.$inferSelect;
export type InsertBid = z.infer<typeof insertBidSchema>;
