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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const SidebarLink = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
      )
    }
  >
    <Icon className="h-4 w-4" />
    <span>{label}</span>
  </NavLink>
);

const sidebarVariants = {
  initial: { x: "-100%" },
  animate: {
    x: 0,
    transition: {
      type: "spring",
      damping: 24,
      stiffness: 250,
    },
  },
  exit: {
    x: "-100%",
    transition: { type: "spring", damping: 24, stiffness: 250 },
  },
};

const DashboardSidebar = () => {
  const { role } = useAuth();

  return (
    <motion.div
      variants={sidebarVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex h-full w-64 flex-col bg-background/95 backdrop-blur border-r"
    >
      {/* Brand */}
      <div className="flex items-center gap-2 border-b px-4 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <ShieldCheck className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold">CareSync</p>
          <p className="text-xs text-muted-foreground">HealthCloud</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-4 px-3 py-4">

        {/* Overview */}
        <div>
          <p className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
            Overview
          </p>
          <SidebarLink
            to="/dashboard"
            icon={LayoutDashboard}
            label="Dashboard"
          />
        </div>

        {/* Care */}
        <div>
          <p className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
            Care
          </p>

          {/* shared for all roles */}
          <SidebarLink
            to="/dashboard/appointments"
            icon={CalendarDays}
            label="Appointments"
          />

          <SidebarLink
            to="/dashboard/records"
            icon={FileText}
            label="Health Records"
          />

          <SidebarLink
            to="/dashboard/ai"
            icon={MessageSquare}
            label="AI Assistant"
          />
        </div>

        {/* Admin */}
        {role === "ADMIN" && (
          <div>
            <p className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
              Admin
            </p>
            <SidebarLink
              to="/dashboard/admin"
              icon={ShieldCheck}
              label="Admin Panel"
            />
          </div>
        )}

        {/* Doctor */}
        {role === "DOCTOR" && (
          <div>
            <p className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
              Doctor
            </p>
            <SidebarLink
              to="/dashboard/doctor"
              icon={Stethoscope}
              label="Doctor View"
            />
          </div>
        )}

        {/* Patient */}
        {role === "PATIENT" && (
          <div>
            <p className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
              Patient
            </p>
            <SidebarLink
              to="/dashboard/patient"
              icon={UserCircle}
              label="My Care"
            />
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t px-4 py-4">
        <Button variant="outline" className="w-full justify-center" asChild>
          <NavLink to="/profile">
            <UserCircle className="mr-2 h-4 w-4" />
            Profile
          </NavLink>
        </Button>
      </div>
    </motion.div>
  );
};

export default DashboardSidebar;
