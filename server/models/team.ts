import { 
  mysqlTable,
  serial,
  text,
  int
} from 'drizzle-orm/mysql-core';
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const teamMembers = mysqlTable('team_members', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull(), // 'upwork' or 'direct'
  target: int('target').notNull(),
  targetClients: int('target_clients').notNull().default(2),
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers);
export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
