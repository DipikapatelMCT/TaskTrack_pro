import { BaseService } from './base.service.ts';
import { bids, type Bid, type InsertBid } from '../models/index.ts';

export class BidsService extends BaseService<Bid> {
  constructor() {
    super(bids);
  }

  async createBid(data: InsertBid): Promise<Bid> {
    return await this.create(data);
  }

  async updateBid(id: number, data: Partial<Bid>): Promise<Bid> {
    return await this.update(id, data);
  }
}

export const bidsService = new BidsService();
