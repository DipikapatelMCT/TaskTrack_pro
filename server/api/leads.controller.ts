import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { leadsService } from '../services/leads.service';
import type { Lead } from '../models';

export class LeadsController extends BaseController<Lead> {
  constructor() {
    super(leadsService);
  }

  async createLead(req: Request, res: Response) {
    try {
      const lead = await leadsService.createLead(req.body);
      res.status(201).json(lead);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateLead(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const lead = await leadsService.updateLead(id, req.body);
      res.json(lead);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const leadsController = new LeadsController();
