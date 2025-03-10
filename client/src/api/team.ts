import { TeamMember, CreateTeamMemberDTO, UpdateTeamMemberDTO } from '../types/team.ts';
import { apiRequest } from '@/lib/queryClient.ts';

export const teamApi = {
  getAll: async (): Promise<TeamMember[]> => {
    try {
      const res = await apiRequest('GET', '/api/team-members');
      if (!res.ok) throw new Error(`Failed to fetch team members: ${res.status}`);
      
      return await res.json();  // Ensure JSON parsing is controlled
    } catch (error) {
      console.error("Error in getAll:", error);
      return []; // Return empty array to prevent crashes
    }
  },

  getById: async (id: number): Promise<TeamMember | null> => {
    try {
      const res = await apiRequest('GET', `/api/team-members/${id}`);
      if (!res.ok) throw new Error(`Failed to fetch member ${id}: ${res.status}`);
      
      return await res.json();
    } catch (error) {
      console.error(`Error in getById(${id}):`, error);
      return null; // Prevent unhandled rejection
    }
  },

  create: async (data: CreateTeamMemberDTO): Promise<TeamMember | null> => {
    try {
      const res = await apiRequest('POST', '/api/team-members', data);
      if (!res.ok) throw new Error(`Failed to create member: ${res.status}`);

      return await res.json();
    } catch (error) {
      console.error("Error in create:", error);
      return null;
    }
  },

  update: async (id: number, data: UpdateTeamMemberDTO): Promise<TeamMember | null> => {
    try {
      const res = await apiRequest('PATCH', `/api/team-members/${id}`, data);
      if (!res.ok) throw new Error(`Failed to update member ${id}: ${res.status}`);

      return await res.json();
    } catch (error) {
      console.error(`Error in update(${id}):`, error);
      return null;
    }
  },

  delete: async (id: number): Promise<boolean> => {
    try {
      const res = await apiRequest('DELETE', `/api/team-members/${id}`);
      if (!res.ok) throw new Error(`Failed to delete member ${id}: ${res.status}`);

      return true;
    } catch (error) {
      console.error(`Error in delete(${id}):`, error);
      return false;
    }
  }
};
