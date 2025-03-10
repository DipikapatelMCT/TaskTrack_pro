import { BaseService } from './base.service.ts';
import { teamMembers, type TeamMember, type InsertTeamMember } from '../models/index.ts';

export class TeamService extends BaseService<TeamMember> {
  constructor() {
    super(teamMembers);
  }

  async createTeamMember(data: InsertTeamMember): Promise<TeamMember> {
    return await this.create(data);
  }

  async updateTeamMember(id: number, data: Partial<TeamMember>): Promise<TeamMember> {
    return await this.update(id, data);
  }
}

export const teamService = new TeamService();
