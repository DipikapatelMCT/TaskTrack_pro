import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import type { TeamMember } from "@shared/schema";
import { useMemo } from "react";

interface TeamSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
}

export function TeamSelect({ value, onValueChange, placeholder = "Filter by team member" }: TeamSelectProps) {
  const { data: teamMembers = [], isLoading } = useQuery<TeamMember[]>({
    queryKey: ["/api/team-members"],
    queryFn: async () => {
      const response = await fetch("/api/team-members");
      if (!response.ok) throw new Error("Failed to fetch team members");
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });

  // Memoize the team members to prevent unnecessary re-renders
  const memoizedMembers = useMemo(() => teamMembers, [teamMembers]);

  return (
    <Select value={value} onValueChange={onValueChange} disabled={isLoading}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder={isLoading ? "Loading..." : placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Team Members</SelectItem>
        {memoizedMembers.map((member) => (
          <SelectItem key={member.id} value={String(member.id)}>
            {member.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
