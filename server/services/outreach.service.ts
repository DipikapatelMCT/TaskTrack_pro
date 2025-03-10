import { BaseService } from './base.service.ts';
import { outreach, type Outreach, type InsertOutreach } from '../models/index.ts';

export class OutreachService extends BaseService<Outreach> {
  constructor() {
    super(outreach);
  }

  async createOutreach(data: InsertOutreach): Promise<Outreach> {
    return await this.create(data);
  }

  async updateOutreach(id: number, data: Partial<Outreach>): Promise<Outreach> {
    return await this.update(id, data);
  }
}

export const outreachService = new OutreachService();
