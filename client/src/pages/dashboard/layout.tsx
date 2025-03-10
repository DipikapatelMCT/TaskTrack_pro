import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      <Outlet />
    </div>
  );
}
