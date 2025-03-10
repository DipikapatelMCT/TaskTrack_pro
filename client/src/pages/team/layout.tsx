import { Outlet } from "react-router-dom";

export default function TeamLayout() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Team Management</h1>
      </div>
      <Outlet />
    </div>
  );
}
