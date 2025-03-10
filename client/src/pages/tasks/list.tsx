import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/shared/data-table";
import { Plus, Search, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Task } from "@shared/schema";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function TasksList() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: tasks = [], isLoading, isError, error } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
    onError: (error: Error) => {
      console.error("Error fetching tasks:", error);
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      });
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async (task: Task) => {
      const response = await apiRequest("PATCH", `/api/tasks/${task.id}`, {
        completed: !task.completed
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Success",
        description: "Task status updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update task status",
        variant: "destructive",
      });
    },
  });

  const columns = [
    { 
      header: "Name",
      accessorKey: "name" as keyof Task,
    },
    { 
      header: "Status",
      accessorKey: "completed" as keyof Task,
      cell: (value: boolean, row: Task) => (
        <div className="flex items-center gap-2">
          <span className={value ? "text-green-600" : "text-yellow-600"}>
            {value ? "Completed" : "Pending"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleStatusMutation.mutate(row)}
            disabled={toggleStatusMutation.isPending}
          >
            {value ? (
              <XCircle className="h-4 w-4 text-yellow-600" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-600" />
            )}
          </Button>
        </div>
      )
    },
    { 
      header: "Due Date",
      accessorKey: "dueDate" as keyof Task,
      cell: (value: string) => format(new Date(value), "PPP")
    }
  ];

  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(search.toLowerCase())
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
        Error loading tasks: {error instanceof Error ? error.message : 'Unknown error'}
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
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Button onClick={() => navigate("/tasks/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filteredTasks}
        onEdit={(task) => navigate(`/tasks/${task.id}`)}
      />
    </div>
  );
}