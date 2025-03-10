import { Outlet } from "react-router-dom";

export default function TasksLayout() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tasks</h1>
      </div>
      <Outlet />
    </div>
  );
}
