import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

// Pages
import DashboardLayout from "@/pages/dashboard/layout";
import DashboardOverview from "@/pages/dashboard/overview";
import TeamLayout from "@/pages/team/layout";
import TeamList from "@/pages/team/list";
import TeamForm from "@/pages/team/form";
import LeadsLayout from "@/pages/leads/layout";
import LeadsList from "@/pages/leads/list";
import LeadDetails from "@/pages/leads/[id]";
import LeadForm from "@/pages/leads/new";
import TasksLayout from "@/pages/tasks/layout";
import TasksList from "@/pages/tasks/list";
import TaskForm from "@/pages/tasks/new";
import TaskDetails from "@/pages/tasks/TaskDetails";
import BidsLayout from "@/pages/bids/layout";
import BidsList from "@/pages/bids/list";
import BidDetails from "@/pages/bids/[id]";
import BidForm from "@/pages/bids/new"; // Added import
import OutreachLayout from "@/pages/outreach/layout";
import OutreachBoard from "@/pages/outreach/board";
import NotFound from "@/pages/not-found";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-auto p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
            </Route>

            <Route path="/team" element={<TeamLayout />}>
              <Route index element={<TeamList />} />
              <Route path="new" element={<TeamForm />} />
              <Route path=":id" element={<TeamForm />} />
            </Route>

            <Route path="/leads" element={<LeadsLayout />}>
              <Route index element={<LeadsList />} />
              <Route path="new" element={<LeadForm />} />
              <Route path=":id" element={<LeadDetails />} />
            </Route>

            <Route path="/tasks" element={<TasksLayout />}>
              <Route index element={<TasksList />} />
              <Route path="new" element={<TaskForm />} />
              <Route path=":id" element={<TaskDetails />} />
            </Route>

            <Route path="/bids" element={<BidsLayout />}> {/* Updated Route */}
              <Route index element={<BidsList />} />
              <Route path="new" element={<BidForm />} /> {/* Added new route */}
              <Route path=":id" element={<BidDetails />} />
            </Route>

            <Route path="/outreach" element={<OutreachLayout />}>
              <Route index element={<OutreachBoard />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;