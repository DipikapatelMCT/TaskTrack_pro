import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Lead } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/shared/data-table";
import { TeamSelect } from "@/components/shared/team-select";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function LeadsList() {
  const [search, setSearch] = useState("");
  const [selectedTeamMember, setSelectedTeamMember] = useState("all");
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: leads = [], isLoading, isError, error } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
    onError: (error: Error) => {
      console.error("Error fetching leads:", error);
      toast({
        title: "Error",
        description: "Failed to fetch leads",
        variant: "destructive",
      });
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  console.log("Leads data:", leads);

  const columns = [
    {
      header: "Name",
      accessorKey: "name" as keyof Lead,
    },
    {
      header: "Company",
      accessorKey: "company" as keyof Lead,
    },
    {
      header: "Status",
      accessorKey: "status" as keyof Lead,
      cell: (value: string) => (
        <span
          className={
            value === "Qualified" ? "text-green-600" :
            value === "New" ? "text-blue-600" :
            "text-yellow-600"
          }
        >
          {value}
        </span>
      ),
    },
    {
      header: "Source",
      accessorKey: "source" as keyof Lead,
    },
    {
      header: "Last Activity",
      accessorKey: "lastActivity" as keyof Lead,
      cell: (value: string) => format(new Date(value), "PPP"),
    },
  ];

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = (
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.company.toLowerCase().includes(search.toLowerCase())
    );
    
    const matchesTeamMember = selectedTeamMember === "all" || 
      lead.addedById.toString() === selectedTeamMember;

    return matchesSearch && matchesTeamMember;
  });

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
        Error loading leads: {error instanceof Error ? error.message : 'Unknown error'}
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
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <TeamSelect 
            value={selectedTeamMember}
            onValueChange={setSelectedTeamMember}
          />
        </div>
        <Button onClick={() => navigate("/leads/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Lead
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filteredLeads}
        onEdit={(lead) => navigate(`/leads/${lead.id}`)}
      />
    </div>
  );
}
