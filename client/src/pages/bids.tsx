import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Bid, InsertBid, TeamMember } from "@shared/schema";
import { DataTable } from "@/components/shared/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { TeamSelect } from "@/components/shared/team-select";
import { format } from "date-fns";
import { Plus, Search } from "lucide-react";

export default function Bids() {
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: bids = [] } = useQuery<Bid[]>({
    queryKey: ["/api/bids"],
  });

  const { data: teamMembers = [] } = useQuery<TeamMember[]>({
    queryKey: ["/api/team-members"],
  });

  const form = useForm<InsertBid>({
    defaultValues: {
      jobTitle: "",
      jobLink: "",
      bidAmount: 0,
      status: "",
      addedById: undefined,
      submissionDate: new Date().toISOString(),
      proposalNotes: ""
    }
  });

  const createBidMutation = useMutation({
    mutationFn: async (data: InsertBid) => {
      const res = await apiRequest("POST", "/api/bids", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bids"] });
      setIsDialogOpen(false);
      form.reset();
      toast({ title: "Bid created successfully" });
    },
  });

  const updateBidMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Bid> }) => {
      const res = await apiRequest("PATCH", `/api/bids/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bids"] });
      setIsDialogOpen(false);
      setSelectedBid(null);
      toast({ title: "Bid updated successfully" });
    },
  });

  const deleteBidMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/bids/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bids"] });
      toast({ title: "Bid deleted successfully" });
    },
  });

  const columns = [
    { header: "Job Title", accessorKey: "jobTitle" },
    { 
      header: "Link", 
      accessorKey: "jobLink",
      cell: (value: string) => (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-primary hover:underline"
        >
          View Job
        </a>
      )
    },
    { 
      header: "Bid Amount", 
      accessorKey: "bidAmount",
      cell: (value: number) => `$${value}`
    },
    { 
      header: "Status", 
      accessorKey: "status",
      cell: (value: string) => {
        const color = value === "Hired" ? "text-emerald-500" : 
                     value === "Lost" ? "text-destructive" : 
                     "text-muted-foreground";
        return <span className={color}>{value}</span>;
      }
    },
    { 
      header: "Submission Date", 
      accessorKey: "submissionDate",
      cell: (value: string) => format(new Date(value), "PPP")
    },
  ];

  const filteredBids = bids.filter(bid =>
    bid.jobTitle.toLowerCase().includes(search.toLowerCase())
  );

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
          <TeamSelect />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              form.reset();
              setSelectedBid(null);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Bid
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedBid ? "Edit Bid" : "Add New Bid"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) => {
                  if (selectedBid) {
                    updateBidMutation.mutate({
                      id: selectedBid.id,
                      data,
                    });
                  } else {
                    createBidMutation.mutate(data);
                  }
                })}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="addedById"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assign To</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select team member" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teamMembers.map(member => (
                            <SelectItem key={member.id} value={member.id.toString()}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jobLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Link</FormLabel>
                      <FormControl>
                        <Input {...field} type="url" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bidAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bid Amount ($)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Submitted">Submitted</SelectItem>
                          <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                          <SelectItem value="Hired">Hired</SelectItem>
                          <SelectItem value="Lost">Lost</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="proposalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proposal Notes</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {selectedBid ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={filteredBids}
        onEdit={(bid) => {
          setSelectedBid(bid);
          form.reset(bid);
          setIsDialogOpen(true);
        }}
        onDelete={(bid) => deleteBidMutation.mutate(bid.id)}
      />
    </div>
  );
}