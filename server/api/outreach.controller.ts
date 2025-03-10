import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { outreachService } from '../services/outreach.service';
import type { Outreach } from '../models';

export class OutreachController extends BaseController<Outreach> {
  constructor() {
    super(outreachService);
  }

  async createOutreach(req: Request, res: Response) {
    try {
      const outreach = await outreachService.createOutreach(req.body);
      res.status(201).json(outreach);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateOutreach(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const outreach = await outreachService.updateOutreach(id, req.body);
      res.json(outreach);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const outreachController = new OutreachController();
