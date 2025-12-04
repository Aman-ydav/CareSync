import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  MessageSquare,
  ShieldCheck,
  Stethoscope,
  UserCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils"; // if you have cn helper, else remove and use template classes
import { Button } from "@/components/ui/button";

const SidebarLink = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
      )
    }
  >
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </NavLink>
);

const DashboardSidebar = () => {
  const { role } = useAuth();

  return (
    <aside className="hidden md:flex h-full flex-col w-64 border-r bg-background/80 backdrop-blur">
      <div className="px-4 py-4 border-b flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-primary" />
        </div>
        <div>
          <div className="font-semibold text-sm">CareSync</div>
          <div className="text-xs text-muted-foreground">HealthCloud</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-4">
        <div>
          <p className="px-2 text-xs font-semibold text-muted-foreground mb-2">
            Overview
          </p>
          <SidebarLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
        </div>

        <div>
          <p className="px-2 text-xs font-semibold text-muted-foreground mb-2">
            Care
          </p>
          <SidebarLink to="/appointments" icon={CalendarDays} label="Appointments" />
          <SidebarLink to="/records" icon={FileText} label="Health Records" />
          <SidebarLink to="/ai-assistant" icon={MessageSquare} label="AI Assistant" />
        </div>

        {role === "ADMIN" && (
          <div>
            <p className="px-2 text-xs font-semibold text-muted-foreground mb-2">
              Admin
            </p>
            <SidebarLink to="/dashboard/admin" icon={ShieldCheck} label="Admin Panel" />
          </div>
        )}

        {role === "DOCTOR" && (
          <div>
            <p className="px-2 text-xs font-semibold text-muted-foreground mb-2">
              Doctor
            </p>
            <SidebarLink to="/dashboard/doctor" icon={Stethoscope} label="Doctor View" />
          </div>
        )}

        {role === "PATIENT" && (
          <div>
            <p className="px-2 text-xs font-semibold text-muted-foreground mb-2">
              Patient
            </p>
            <SidebarLink to="/dashboard/patient" icon={UserCircle} label="My Care" />
          </div>
        )}
      </nav>

      <div className="px-4 py-4 border-t">
        <Button variant="outline" className="w-full justify-center" asChild>
          <NavLink to="/profile">
            <UserCircle className="w-4 h-4 mr-2" />
            Profile
          </NavLink>
        </Button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
