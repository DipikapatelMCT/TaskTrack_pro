import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import type { TeamMember } from "@shared/schema";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export function PerformanceMatrix() {
  // Fetch team members with proper caching
  const { data: teamMembers = [] } = useQuery<TeamMember[]>({ 
    queryKey: ["/api/team-members"],
    queryFn: async () => {
      const res = await fetch("/api/team-members", { credentials: "include" });
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes to reduce API calls
  });

  // Cache computed performance data to avoid unnecessary re-renders
  const memberPerformance = useMemo(() => teamMembers.map(member => ({
    ...member,
    revenueAchieved: Math.floor(Math.random() * member.target), // Simulated data
    clientsOnboarded: Math.floor(Math.random() * 3), // Simulated data
  })), [teamMembers]); // Recompute only when `teamMembers` changes

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {memberPerformance.map((member) => {
            const revenueProgress = (member.revenueAchieved / member.target) * 100;
            const isUnderperforming = 
              revenueProgress < 100 || member.clientsOnboarded < member.targetClients;

            return (
              <div 
                key={member.id} 
                className="grid grid-cols-5 gap-4 items-center p-2 rounded-lg hover:bg-accent"
              >
                <div className={cn(
                  "font-medium",
                  isUnderperforming && "border-b-2 border-destructive"
                )}>
                  {member.name}
                </div>
                <div className="text-sm">
                  ${member.revenueAchieved} / ${member.target}
                </div>
                <div className="col-span-2">
                  <Progress value={revenueProgress} />
                </div>
                <div className="flex items-center justify-end gap-2 text-sm">
                  <span>
                    {member.clientsOnboarded} / {member.targetClients} clients
                  </span>
                  {!isUnderperforming && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
