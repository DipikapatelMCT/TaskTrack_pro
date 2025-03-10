import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { bidsService } from '../services/bids.service';
import type { Bid } from '../models';

export class BidsController extends BaseController<Bid> {
  constructor() {
    super(bidsService);
  }

  async createBid(req: Request, res: Response) {
    try {
      const bid = await bidsService.createBid(req.body);
      res.status(201).json(bid);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateBid(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const bid = await bidsService.updateBid(id, req.body);
      res.json(bid);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const bidsController = new BidsController();
