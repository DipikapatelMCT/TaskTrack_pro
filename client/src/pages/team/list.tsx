import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/shared/data-table";
import { Plus, Search, Loader2 } from "lucide-react";
import { TeamMember } from "@/types/team";
import { teamApi } from "@/api/team";
import { useToast } from "@/hooks/use-toast";

// Dummy data for development
const dummyTeamMembers: TeamMember[] = [
  {
    id: 1,
    name: "John Smith",
    role: "upwork",
    target: 5000,
    targetClients: 3
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "direct",
    target: 7500,
    targetClients: 4
  },
  {
    id: 3,
    name: "Michael Brown",
    role: "upwork",
    target: 6000,
    targetClients: 3
  }
];

export default function TeamList() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: members = dummyTeamMembers, isLoading, isError } = useQuery<TeamMember[]>({
    queryKey: ["/api/team-members"],
    initialData: dummyTeamMembers
  });

  const handleDelete = async (id: number) => {
    try {
      await teamApi.delete(id);
      toast({ title: "Success", description: "Team member deleted successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete team member",
        variant: "destructive",
      });
    }
  };

  const columns = [
    { 
      header: "Name",
      accessorKey: "name" as keyof TeamMember
    },
    { 
      header: "Role",
      accessorKey: "role" as keyof TeamMember
    },
    { 
      header: "Target ($)",
      accessorKey: "target" as keyof TeamMember,
      cell: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      header: "Target Clients",
      accessorKey: "targetClients" as keyof TeamMember
    }
  ];

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-destructive">
        Error loading team members. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative w-[300px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search team members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Button onClick={() => navigate("/team/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filteredMembers}
        onEdit={(member) => navigate(`/team/${member.id}`)}
        onDelete={(member) => handleDelete(member.id)}
      />
    </div>
  );
}