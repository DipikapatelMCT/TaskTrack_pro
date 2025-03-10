import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { storage } from '../storage';
import type { TeamMember, InsertTeamMember } from '@shared/schema';

class TeamController extends BaseController<TeamMember> {
  async getAll(_req: Request, res: Response) {
    try {
      const members = await storage.getTeamMembers();
      res.json(members);
    } catch (error) {
      console.error('Error getting team members:', error);
      res.status(500).json({ error: 'Failed to get team members' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      console.log('Creating team member with data:', req.body);
      const member = await storage.createTeamMember(req.body as InsertTeamMember);
      console.log('Team member created:', member);
      res.status(201).json(member);
    } catch (error) {
      console.error('Error creating team member:', error);
      res.status(500).json({ 
        error: 'Failed to create team member',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const member = await storage.updateTeamMember(id, req.body);
      res.json(member);
    } catch (error) {
      console.error('Error updating team member:', error);
      res.status(500).json({ error: 'Failed to update team member' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTeamMember(id);
      res.sendStatus(204);
    } catch (error) {
      console.error('Error deleting team member:', error);
      res.status(500).json({ error: 'Failed to delete team member' });
    }
  }
}

export const teamController = new TeamController(storage);