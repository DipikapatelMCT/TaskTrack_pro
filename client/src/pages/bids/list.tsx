import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/shared/data-table";
import { Plus, Search, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Bid } from "@shared/schema";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function BidsList() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: bids = [], isLoading, isError, error } = useQuery<Bid[]>({
    queryKey: ["/api/bids"],
    onError: (error: Error) => {
      console.error("Error fetching bids:", error);
      toast({
        title: "Error",
        description: "Failed to fetch bids",
        variant: "destructive",
      });
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  console.log("Bids data:", bids);

  const columns = [
    { 
      header: "Job Title",
      accessorKey: "jobTitle" as keyof Bid,
    },
    { 
      header: "Bid Amount",
      accessorKey: "bidAmount" as keyof Bid,
      cell: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      header: "Status",
      accessorKey: "status" as keyof Bid,
      cell: (value: string) => (
        <span className={
          value === "Accepted" ? "text-green-600" :
          value === "Rejected" ? "text-red-600" :
          "text-yellow-600"
        }>
          {value}
        </span>
      )
    },
    { 
      header: "Submission Date",
      accessorKey: "submissionDate" as keyof Bid,
      cell: (value: string) => format(new Date(value), "PPP")
    }
  ];

  const filteredBids = bids.filter(bid =>
    bid.jobTitle.toLowerCase().includes(search.toLowerCase())
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
        Error loading bids: {error instanceof Error ? error.message : 'Unknown error'}
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
              placeholder="Search bids..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Button onClick={() => navigate("/bids/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Bid
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filteredBids}
        onEdit={(bid) => navigate(`/bids/${bid.id}`)}
      />
    </div>
  );
}