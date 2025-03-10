import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Search, Loader2 } from "lucide-react";
import { InsertOutreach, insertOutreachSchema, Outreach } from "@shared/schema";

const CHANNELS = ["LinkedIn", "Email", "WhatsApp", "Job Boards", "Staff Augmentation"] as const;
const STAGES = ["Lead Identified", "Contacted", "Engaged", "Proposal Sent", "Closed"] as const;

export default function OutreachBoard() {
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertOutreach>({
    resolver: zodResolver(insertOutreachSchema),
    defaultValues: {
      leadName: "",
      channel: "",
      stage: "",
      addedById: 1, // Default user ID
      notes: "",
    },
  });

  const { data: outreach = [], isLoading, isError } = useQuery<Outreach[]>({
    queryKey: ["/api/outreach"],
    onError: (error: Error) => {
      console.error("Error fetching outreach:", error);
      toast({
        title: "Error",
        description: "Failed to fetch outreach data",
        variant: "destructive",
      });
    },
  });

  const createOutreachMutation = useMutation({
    mutationFn: async (data: InsertOutreach) => {
      const response = await apiRequest("POST", "/api/outreach", data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create outreach");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/outreach"] });
      toast({
        title: "Success",
        description: "Outreach created successfully",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create outreach",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: InsertOutreach) => {
    try {
      await createOutreachMutation.mutateAsync(data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

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
        Error loading outreach data. Please try again.
      </div>
    );
  }

  const filteredOutreach = outreach.filter(item => 
    item.leadName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative w-[300px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search outreach..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Outreach
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Outreach</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="leadName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lead Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter lead name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="channel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Channel</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select channel" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CHANNELS.map(channel => (
                            <SelectItem key={channel} value={channel}>
                              {channel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stage</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select stage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {STAGES.map(stage => (
                            <SelectItem key={stage} value={stage}>
                              {stage}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter notes" />
                      </FormControl>
                      <FormMessage />
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
                  <Button type="submit" disabled={createOutreachMutation.isPending}>
                    {createOutreachMutation.isPending ? "Creating..." : "Create"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {STAGES.map(stage => {
          const stageItems = filteredOutreach.filter(item => item.stage === stage);

          return (
            <div key={stage} className="space-y-4">
              <div className="font-medium bg-accent p-2 rounded-md text-center">
                {stage}
                <span className="ml-2 text-sm text-muted-foreground">
                  ({stageItems.length})
                </span>
              </div>

              <div className="space-y-2">
                {stageItems.map(item => (
                  <div
                    key={item.id}
                    className="bg-card p-4 rounded-lg shadow-sm"
                  >
                    <div className="font-medium">{item.leadName}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.channel}
                    </div>
                    {item.notes && (
                      <div className="text-sm text-muted-foreground mt-2">
                        {item.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}