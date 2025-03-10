import { 
  mysqlTable,
  serial,
  text,
  int,
  timestamp,
  boolean
} from 'drizzle-orm/mysql-core';
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { teamMembers } from './team';

export const tasks = mysqlTable('tasks', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  addedById: int('added_by_id').notNull().references(() => teamMembers.id),
  dueDate: timestamp('due_date').notNull(),
  completed: boolean('completed').notNull().default(false),
});

export const insertTaskSchema = createInsertSchema(tasks);
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
