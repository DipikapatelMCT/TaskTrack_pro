import { Outlet } from "react-router-dom";

export default function LeadsLayout() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Leads</h1>
      </div>
      <Outlet />
    </div>
  );
}
