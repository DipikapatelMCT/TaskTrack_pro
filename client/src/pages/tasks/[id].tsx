import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Task } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { Loader2, CheckCircle, XCircle, ArrowLeft } from "lucide-react";

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: task, isLoading, isError, error } = useQuery<Task>({
    queryKey: ["/api/tasks", id],
    queryFn: async () => {
      try {
        console.log(`Fetching task ${id}`);
        const response = await apiRequest("GET", `/api/tasks/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch task');
        }
        const data = await response.json();
        console.log('Fetched task:', data);
        return data;
      } catch (error) {
        console.error("Error fetching task:", error);
        throw error;
      }
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async () => {
      if (!task) return;
      console.log(`Updating task ${id} status to ${!task.completed}`);
      const response = await apiRequest("PATCH", `/api/tasks/${id}`, {
        completed: !task.completed
      });
      if (!response.ok) {
        throw new Error('Failed to update task status');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks", id] });
      toast({
        title: "Success",
        description: `Task marked as ${task?.completed ? 'pending' : 'completed'}`,
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !task) {
    return (
      <div className="text-center space-y-4">
        <p className="text-destructive">
          {error instanceof Error ? error.message : 'Error loading task'}
        </p>
        <Button variant="outline" onClick={() => navigate("/tasks")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tasks
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Task Details</h2>
        <Button variant="outline" onClick={() => navigate("/tasks")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tasks
        </Button>
      </div>

      <div className="space-y-4 p-6 border rounded-lg bg-card">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Task Name</h3>
          <p className="text-lg font-medium">{task.name}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Due Date</h3>
          <p className="text-lg">{format(new Date(task.dueDate), "PPP")}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
          <div className="flex items-center gap-4 mt-2">
            <span className={task.completed ? "text-green-600" : "text-yellow-600"}>
              {task.completed ? "Completed" : "Pending"}
            </span>
            <Button 
              variant="outline" 
              onClick={() => toggleStatusMutation.mutate()}
              disabled={toggleStatusMutation.isPending}
              className="flex items-center gap-2"
            >
              {toggleStatusMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : task.completed ? (
                <>
                  <XCircle className="h-4 w-4 text-yellow-600" />
                  Mark as Pending
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Mark as Completed
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}