import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { tasksService } from '../services/tasks.service';
import type { Task } from '../models';

export class TasksController extends BaseController<Task> {
  constructor() {
    super(tasksService);
  }

  async createTask(req: Request, res: Response) {
    try {
      const task = await tasksService.createTask(req.body);
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateTask(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const task = await tasksService.updateTask(id, req.body);
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const tasksController = new TasksController();
