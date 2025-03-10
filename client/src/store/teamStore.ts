import { create } from 'zustand';
import { TeamMember } from '@/types/team';
import { teamApi } from '@/api/team';

interface TeamState {
  members: TeamMember[];
  loading: boolean;
  error: string | null;
  fetchMembers: () => Promise<void>;
  addMember: (member: TeamMember) => void;
  updateMember: (id: number, member: TeamMember) => void;
  removeMember: (id: number) => void;
}

export const useTeamStore = create<TeamState>((set) => ({
  members: [],
  loading: false,
  error: null,
  fetchMembers: async () => {
    set({ loading: true });
    try {
      const members = await teamApi.getAll();
      set({ members, loading: false, error: null });
    } catch (error) {
      set({ error: 'Failed to fetch team members', loading: false });
    }
  },
  addMember: (member) => 
    set((state) => ({ members: [...state.members, member] })),
  updateMember: (id, updatedMember) =>
    set((state) => ({
      members: state.members.map((member) =>
        member.id === id ? updatedMember : member
      ),
    })),
  removeMember: (id) =>
    set((state) => ({
      members: state.members.filter((member) => member.id !== id),
    })),
}));
