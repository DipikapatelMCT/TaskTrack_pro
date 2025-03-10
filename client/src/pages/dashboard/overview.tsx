import { PerformanceMatrix } from "@/components/dashboard/performance-matrix";
import { StatsGrid } from "@/components/dashboard/stats-grid";

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <StatsGrid />
      <PerformanceMatrix />
    </div>
  );
}
