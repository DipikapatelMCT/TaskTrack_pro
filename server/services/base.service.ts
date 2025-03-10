// import { db } from './db.ts';
// import { SQL, eq } from 'drizzle-orm';
// import { MySqlTable } from 'drizzle-orm/mysql-core';

// export class BaseService<T> {
//   protected table: MySqlTable;

//   constructor(table: MySqlTable) {
//     this.table = table;
//   }

//   async findAll(where?: SQL<unknown>): Promise<T[]> {
//     const query = where ? 
//       db.select().from(this.table).where(where) :
//       db.select().from(this.table);
//     return await query;
//   }

//   async findById(id: number): Promise<T | undefined> {
//     const [result] = await db
//       .select()
//       .from(this.table)
//       .where(eq(this.table.id, id))
//       .limit(1);
//     return result;
//   }

//   async create(data: Partial<T>): Promise<T> {
//     const [result] = await db
//       .insert(this.table)
//       .values(data)
//       .execute();
//     return result;
//   }

//   async update(id: number, data: Partial<T>): Promise<T> {
//     await db
//       .update(this.table)
//       .set(data)
//       .where(eq(this.table.id, id))
//       .execute();

//     return this.findById(id) as Promise<T>;
//   }

//   async delete(id: number): Promise<void> {
//     await db
//       .delete(this.table)
//       .where(eq(this.table.id, id))
//       .execute();
//   }
// }


import { db } from '../db.ts';
import { SQL, eq } from 'drizzle-orm';
import { MySqlTable } from 'drizzle-orm/mysql-core';

export class BaseService<T> {
  protected table: any; // Using 'any' temporarily to bypass the error

  constructor(table: MySqlTable) {
    this.table = table;
  }

  async findAll(where?: SQL<unknown>): Promise<T[]> {
    const query = where ? 
      db.select().from(this.table).where(where) :
      db.select().from(this.table);
    return await query as T[];
  }

  async findById(id: number): Promise<T | undefined> {
    const [result] = await db
      .select()
      .from(this.table)
      .where(eq(this.table.id, id))
      .limit(1);
    return result as T;
  }

  async create(data: Partial<T>): Promise<T> {
    const [result] = await db
      .insert(this.table)
      .values(data as any)
      .execute();
    return result as T;
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    await db
      .update(this.table)
      .set(data as any)
      .where(eq(this.table.id, id))
      .execute();

    return this.findById(id) as Promise<T>;
  }

  async delete(id: number): Promise<void> {
    await db
      .delete(this.table)
      .where(eq(this.table.id, id))
      .execute();
  }
}