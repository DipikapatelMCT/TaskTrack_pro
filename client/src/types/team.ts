export interface TeamMember {
  id: number;
  name: string;
  role: string;
  target: number;
  targetClients: number;
}

export interface CreateTeamMemberDTO {
  name: string;
  role: string;
  target: number;
  targetClients?: number;
}

export interface UpdateTeamMemberDTO extends Partial<CreateTeamMemberDTO> {}
