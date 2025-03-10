import {
  TeamMember, InsertTeamMember,
  Lead, InsertLead,
  Task, InsertTask,
  Bid, InsertBid,
  Outreach, InsertOutreach,
  teamMembers,
  leads,
  tasks,
  bids,
  outreach
} from "@shared/schema.ts";
import { db } from "./db.ts";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Team Members
  getTeamMembers(): Promise<TeamMember[]>;
  getTeamMemberById(id: number): Promise<TeamMember | undefined>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: number, member: Partial<TeamMember>): Promise<TeamMember>;
  deleteTeamMember(id: number): Promise<void>;

  // Leads
  getLeads(): Promise<Lead[]>;
  getLeadById(id: number): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: number, lead: Partial<Lead>): Promise<Lead>;
  deleteLead(id: number): Promise<void>;

  // Tasks
  getTasks(): Promise<Task[]>;
  getTaskById(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<Task>): Promise<Task>;
  deleteTask(id: number): Promise<void>;

  // Bids
  getBids(): Promise<Bid[]>;
  getBidById(id: number): Promise<Bid | undefined>;
  createBid(bid: InsertBid): Promise<Bid>;
  updateBid(id: number, bid: Partial<Bid>): Promise<Bid>;
  deleteBid(id: number): Promise<void>;

  // Outreach
  getOutreach(): Promise<Outreach[]>;
  getOutreachById(id: number): Promise<Outreach | undefined>;
  createOutreach(outreach: InsertOutreach): Promise<Outreach>;
  updateOutreach(id: number, outreach: Partial<Outreach>): Promise<Outreach>;
  deleteOutreach(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Team Members
  async getTeamMembers(): Promise<TeamMember[]> {
    return await db.select().from(teamMembers);
  }

  async getTeamMemberById(id: number): Promise<TeamMember | undefined> {
    const [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, id));
    return member;
  }

  async createTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const [newMember] = await db.insert(teamMembers).values(member).returning();
    return newMember;
  }

  async updateTeamMember(id: number, member: Partial<TeamMember>): Promise<TeamMember> {
    const [updated] = await db
      .update(teamMembers)
      .set(member)
      .where(eq(teamMembers.id, id))
      .returning();
    return updated;
  }

  async deleteTeamMember(id: number): Promise<void> {
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
  }

  // Leads
  async getLeads(): Promise<Lead[]> {
    try {
      console.log('Fetching all leads from PostgreSQL');
      const result = await db.select().from(leads);
      console.log('Retrieved leads:', result);
      return result;
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
  }

  async getLeadById(id: number): Promise<Lead | undefined> {
    console.log(`Fetching lead with id ${id} from PostgreSQL`);
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead;
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    console.log('Creating new lead in PostgreSQL:', lead);
    const [newLead] = await db.insert(leads).values({
      ...lead,
      lastActivity: lead.lastActivity instanceof Date ? lead.lastActivity : new Date(lead.lastActivity),
    }).returning();
    console.log('Created lead:', newLead);
    return newLead;
  }

  async updateLead(id: number, lead: Partial<Lead>): Promise<Lead> {
    console.log(`Updating lead ${id} in PostgreSQL:`, lead);
    const [updated] = await db
      .update(leads)
      .set(lead)
      .where(eq(leads.id, id))
      .returning();
    console.log('Updated lead:', updated);
    return updated;
  }

  async deleteLead(id: number): Promise<void> {
    console.log(`Deleting lead ${id} from PostgreSQL`);
    await db.delete(leads).where(eq(leads.id, id));
    console.log('Lead deleted successfully');
  }

  // Tasks
  async getTasks(): Promise<Task[]> {
    return await db.select().from(tasks);
  }

  async getTaskById(id: number): Promise<Task | undefined> {
    console.log(`Fetching task with id ${id} from PostgreSQL`);
    try {
      const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
      console.log('Retrieved task:', task);
      return task;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  }

  async createTask(task: InsertTask): Promise<Task> {
    console.log('Creating new task in PostgreSQL:', task);
    const [newTask] = await db.insert(tasks).values({
      ...task,
      dueDate: task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate),
    }).returning();
    console.log('Created task:', newTask);
    return newTask;
  }

  async updateTask(id: number, task: Partial<Task>): Promise<Task> {
    console.log(`Updating task ${id} in PostgreSQL:`, task);
    try {
      const [updated] = await db
        .update(tasks)
        .set(task)
        .where(eq(tasks.id, id))
        .returning();
      console.log('Updated task:', updated);
      return updated;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async deleteTask(id: number): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  // Bids
  async getBids(): Promise<Bid[]> {
    try {
      console.log('Fetching all bids from PostgreSQL');
      const result = await db.select().from(bids);
      console.log('Retrieved bids:', result);
      return result;
    } catch (error) {
      console.error('Error fetching bids:', error);
      throw error;
    }
  }

  async getBidById(id: number): Promise<Bid | undefined> {
    try {
      console.log(`Fetching bid with id ${id} from PostgreSQL`);
      const [bid] = await db.select().from(bids).where(eq(bids.id, id));
      console.log('Retrieved bid:', bid);
      return bid;
    } catch (error) {
      console.error('Error fetching bid:', error);
      throw error;
    }
  }

  async createBid(bid: InsertBid): Promise<Bid> {
    try {
      console.log('Creating new bid in PostgreSQL:', bid);
      const [newBid] = await db.insert(bids).values({
        ...bid,
        submissionDate: bid.submissionDate ? (bid.submissionDate instanceof Date ? bid.submissionDate : new Date(bid.submissionDate)) : undefined,
      }).returning();
      console.log('Created bid:', newBid);
      return newBid;
    } catch (error) {
      console.error('Error creating bid:', error);
      throw error;
    }
  }

  async updateBid(id: number, bid: Partial<Bid>): Promise<Bid> {
    try {
      console.log(`Updating bid ${id} in PostgreSQL:`, bid);
      const [updated] = await db
        .update(bids)
        .set(bid)
        .where(eq(bids.id, id))
        .returning();
      console.log('Updated bid:', updated);
      return updated;
    } catch (error) {
      console.error('Error updating bid:', error);
      throw error;
    }
  }

  async deleteBid(id: number): Promise<void> {
    try {
      console.log(`Deleting bid ${id} from PostgreSQL`);
      await db.delete(bids).where(eq(bids.id, id));
      console.log('Bid deleted successfully');
    } catch (error) {
      console.error('Error deleting bid:', error);
      throw error;
    }
  }

  // Outreach
  async getOutreach(): Promise<Outreach[]> {
    return await db.select().from(outreach);
  }

  async getOutreachById(id: number): Promise<Outreach | undefined> {
    const [item] = await db.select().from(outreach).where(eq(outreach.id, id));
    return item;
  }

  async createOutreach(outreachData: InsertOutreach): Promise<Outreach> {
    const [newOutreach] = await db.insert(outreach).values(outreachData).returning();
    return newOutreach;
  }

  async updateOutreach(id: number, outreachData: Partial<Outreach>): Promise<Outreach> {
    const [updated] = await db
      .update(outreach)
      .set(outreachData)
      .where(eq(outreach.id, id))
      .returning();
    return updated;
  }

  async deleteOutreach(id: number): Promise<void> {
    await db.delete(outreach).where(eq(outreach.id, id));
  }
}

export const storage = new DatabaseStorage();