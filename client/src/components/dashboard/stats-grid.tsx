import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  UserSquare2, 
  CheckSquare, 
  Trophy,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Lead, Task, Bid } from "@shared/schema";
import { isToday } from "date-fns";
import { useMemo } from "react";

export function StatsGrid() {
  // Fetch leads data
  const { data: leads = [] } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
    queryFn: async () => {
      const res = await fetch("/api/leads", { credentials: "include" });
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Fetch tasks data
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
    queryFn: async () => {
      const res = await fetch("/api/tasks", { credentials: "include" });
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch bids data
  const { data: bids = [] } = useQuery<Bid[]>({
    queryKey: ["/api/bids"],
    queryFn: async () => {
      const res = await fetch("/api/bids", { credentials: "include" });
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  // Use useMemo to prevent unnecessary recalculations
  const tasksDueToday = useMemo(() => 
    tasks.filter(task => isToday(new Date(task.dueDate))).length, 
  [tasks]);

  const totalWins = useMemo(() => 
    bids.filter(bid => bid.status === "Accepted").length, 
  [bids]);

  const stats = [
    { title: "Total Leads", value: leads.length.toString(), icon: UserSquare2, trend: 12 },
    { title: "Tasks Due Today", value: tasksDueToday.toString(), icon: CheckSquare, trend: -3 },
    { title: "Total Wins", value: totalWins.toString(), icon: Trophy, trend: 8 }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center text-sm text-muted-foreground">
              {stat.trend > 0 ? (
                <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span className={stat.trend > 0 ? "text-emerald-500" : "text-red-500"}>
                {Math.abs(stat.trend)}%
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
