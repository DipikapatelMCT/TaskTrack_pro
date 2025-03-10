import { BaseService } from './base.service.ts';
import { leads, type Lead, type InsertLead } from '../models/index.ts';

export class LeadsService extends BaseService<Lead> {
  constructor() {
    super(leads);
  }

  async createLead(data: InsertLead): Promise<Lead> {
    return await this.create(data);
  }

  async updateLead(id: number, data: Partial<Lead>): Promise<Lead> {
    return await this.update(id, data);
  }
}

export const leadsService = new LeadsService();
