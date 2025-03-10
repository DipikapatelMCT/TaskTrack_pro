import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "../shared/schema.js";

// Direct connection string with explicit values
let DATABASE_URL: string = process.env.DATABASE_URL || "postgres://postgres:root@localhost:5432/tasktrackpro_db";
const queryClient = postgres(DATABASE_URL);
export const db = drizzle(queryClient, { schema });