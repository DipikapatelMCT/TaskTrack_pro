import { BaseService } from './base.service.ts';
import { tasks, type Task, type InsertTask } from '../models/index.ts';

export class TasksService extends BaseService<Task> {
  constructor() {
    super(tasks);
  }

  async createTask(data: InsertTask): Promise<Task> {
    return await this.create(data);
  }

  async updateTask(id: number, data: Partial<Task>): Promise<Task> {
    return await this.update(id, data);
  }
}

export const tasksService = new TasksService();
