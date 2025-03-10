import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { TeamSelect } from "@/components/shared/team-select";

export function Topbar() {
  return (
    <header className="h-[60px] border-b border-border bg-background px-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-foreground truncate">
        Team Sales Admin Panel
      </h1>
      <div className="flex items-center gap-4">
        <TeamSelect />
        <ExportButton />
      </div>
    </header>
  );
}

function ExportButton() {
  return (
    <Button aria-label="Export sales data">
      <FileDown className="h-4 w-4 mr-2" />
      <span className="hidden sm:inline">Export Data</span>
    </Button>
  );
}
