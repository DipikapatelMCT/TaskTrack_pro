import { Outlet } from "react-router-dom";

export default function OutreachLayout() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Outreach</h1>
      </div>
      <Outlet />
    </div>
  );
}
