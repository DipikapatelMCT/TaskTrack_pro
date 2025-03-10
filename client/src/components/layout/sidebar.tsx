import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  ChevronLeft, 
  ChevronRight,
  UserSquare2,
  CheckSquare,
  FileText,
  PhoneCall,
  BarChart3,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => {
    // Retrieve from localStorage on initial render
    return JSON.parse(localStorage.getItem("sidebar-collapsed") || "false");
  });

  // Store collapsed state in localStorage
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  // Memoize links to avoid unnecessary re-renders
  const links = useMemo(() => [
    { href: "/", icon: BarChart3, label: "Dashboard" },
    { href: "/team", icon: Users, label: "Team" },
    { href: "/leads", icon: UserSquare2, label: "Leads" },
    { href: "/tasks", icon: CheckSquare, label: "Tasks" },
    { href: "/bids", icon: FileText, label: "Bids" },
    { href: "/outreach", icon: PhoneCall, label: "Outreach" },
  ], []);

  return (
    <aside 
      className={cn(
        "bg-sidebar h-screen transition-all duration-300",
        collapsed ? "w-[60px]" : "w-[250px]"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && <h1 className="text-sidebar-foreground font-bold">Sales Admin</h1>}
        <Button 
          variant="ghost" 
          size="icon"
          className="text-sidebar-foreground"
          onClick={() => setCollapsed((prev: boolean) => !prev)}
          aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>

      <nav className="p-2">
        {links.map(({ href, icon: Icon, label }) => (
          <Link 
            key={href} 
            to={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              location.pathname === href && "bg-sidebar-accent text-sidebar-accent-foreground",
              collapsed ? "justify-center" : "justify-start"
            )}
            aria-current={location.pathname === href ? "page" : undefined}
          >
            <Icon className="h-5 w-5" />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
