import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Outreach as OutreachType, InsertOutreach, TeamMember } from "@shared/schema";
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
import { useForm } from "react-hook-form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { TeamSelect } from "@/components/shared/team-select";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

// Pipeline stages in order
const STAGES = [
  "Lead Identified",
  "Contacted",
  "Engaged",
  "Proposal Sent",
  "Closed"
] as const;

const CHANNELS = [
  "LinkedIn",
  "Email",
  "WhatsApp",
  "Job Boards",
  "Staff Augmentation"
] as const;

export default function OutreachBoard() {
  const [search, setSearch] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<string>("all");
  const { toast } = useToast();
  const [selectedOutreach, setSelectedOutreach] = useState<OutreachType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [draggingId, setDraggingId] = useState<number | null>(null);

  const { data: outreach = [] } = useQuery<OutreachType[]>({
    queryKey: ["/api/outreach"],
  });

  const { data: teamMembers = [] } = useQuery<TeamMember[]>({
    queryKey: ["/api/team-members"],
  });

  const form = useForm<InsertOutreach>({
    defaultValues: {
      leadName: "",
      channel: "",
      stage: "",
      notes: "",
      addedById: undefined 
    }
  });

  const createOutreachMutation = useMutation({
    mutationFn: async (data: InsertOutreach) => {
      const res = await apiRequest("POST", "/api/outreach", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/outreach"] });
      setIsDialogOpen(false);
      form.reset();
      toast({ title: "Outreach created successfully" });
    },
  });

  const updateOutreachMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<OutreachType> }) => {
      const res = await apiRequest("PATCH", `/api/outreach/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/outreach"] });
      setIsDialogOpen(false);
      setSelectedOutreach(null);
      toast({ title: "Outreach updated successfully" });
    },
  });

  const deleteOutreachMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/outreach/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/outreach"] });
      toast({ title: "Outreach deleted successfully" });
    },
  });

  const filteredOutreach = outreach.filter(item => {
    const matchesSearch = item.leadName.toLowerCase().includes(search.toLowerCase());
    const matchesChannel = selectedChannel === "all" || item.channel === selectedChannel;
    return matchesSearch && matchesChannel;
  });

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggingId(id);
    e.currentTarget.classList.add("opacity-50");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggingId(null);
    e.currentTarget.classList.remove("opacity-50");
  };

  const handleDragOver = (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    if (draggingId !== null) {
      updateOutreachMutation.mutate({
        id: draggingId,
        data: { stage }
      });
    }
  };

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
          <Select
            value={selectedChannel}
            onValueChange={setSelectedChannel}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              {CHANNELS.map(channel => (
                <SelectItem key={channel} value={channel}>{channel}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <TeamSelect />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              form.reset();
              setSelectedOutreach(null);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Outreach
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedOutreach ? "Edit Outreach" : "Add New Outreach"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) => {
                  if (selectedOutreach) {
                    updateOutreachMutation.mutate({
                      id: selectedOutreach.id,
                      data,
                    });
                  } else {
                    createOutreachMutation.mutate(data);
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
                  name="leadName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lead Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="channel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Channel</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select channel" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CHANNELS.map(channel => (
                            <SelectItem key={channel} value={channel}>{channel}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stage</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select stage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {STAGES.map(stage => (
                            <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                        <Textarea {...field} value={field.value || ""} />
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
                    {selectedOutreach ? "Update" : "Create"}
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
            <div
              key={stage}
              className="space-y-4"
              onDragOver={(e) => handleDragOver(e, stage)}
            >
              <div className="font-medium bg-accent p-2 rounded-md text-center">
                {stage}
                <span className="ml-2 text-sm text-muted-foreground">
                  ({stageItems.length})
                </span>
              </div>

              {stageItems.map(item => (
                <Card
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onDragEnd={handleDragEnd}
                  className="cursor-move"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{item.leadName}</div>
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {item.channel}
                    </div>
                    {item.notes && (
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {item.notes}
                      </div>
                    )}
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedOutreach(item);
                          form.reset(item);
                          setIsDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => deleteOutreachMutation.mutate(item.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}