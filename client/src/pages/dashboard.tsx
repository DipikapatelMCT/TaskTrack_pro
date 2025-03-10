import { StatsGrid } from "@/components/dashboard/stats-grid";
import { PerformanceMatrix } from "@/components/dashboard/performance-matrix";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const activityData = [
  { month: "Jan", bids: 65, outreach: 28, wins: 15 },
  { month: "Feb", bids: 59, outreach: 48, wins: 17 },
  { month: "Mar", bids: 80, outreach: 40, wins: 20 },
  { month: "Apr", bids: 81, outreach: 47, wins: 22 },
  { month: "May", bids: 56, outreach: 39, wins: 14 },
  { month: "Jun", bids: 55, outreach: 48, wins: 19 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <StatsGrid />
      
      <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Activity Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="bids" 
                    stroke="hsl(var(--chart-1))" 
                    name="Bids"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="outreach" 
                    stroke="hsl(var(--chart-2))" 
                    name="Outreach"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="wins" 
                    stroke="hsl(var(--chart-3))" 
                    name="Wins"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <PerformanceMatrix />
      </div>
    </div>
  );
}
