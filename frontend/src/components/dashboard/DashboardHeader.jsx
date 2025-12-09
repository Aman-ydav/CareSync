import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import { logoutUser } from "@/features/auth/authSlice";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from "@/components/ui/ThemeToggle";

import {
  Menu,
  ChevronDown,
  LayoutDashboard,
  User,
  Settings,
  Shield,
  Stethoscope,
  BadgeCheck,
  Building2,
  LogOut,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";


export default function DashboardHeader({ onToggleSidebar }) {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // Role configuration
  const roleConfig = {
    ADMIN: {
      label: "Admin Panel",
      color: "text-purple-600",
      bg: "bg-purple-500/10",
      Icon: Shield,
    },
    DOCTOR: {
      label: "Doctor Panel",
      color: "text-blue-600",
      bg: "bg-blue-500/10",
      Icon: Stethoscope,
    },
    PATIENT: {
      label: "Patient Portal",
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
      Icon: BadgeCheck,
    },
  };

  const role = roleConfig[user?.role] || roleConfig.PATIENT;
  const RoleIcon = role.Icon;

  return (
    <header
      className="
        sticky top-0 z-40
        flex items-center justify-between
        bg-card
        border-b
        px-4 py-2.5 md:px-6
      "
    >
      {/* LEFT SECTION */}
      <div className="flex items-center gap-4">
        {/* Mobile Sidebar Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* User Info */}
        <div className="flex flex-col">
          <h1 className="text-base font-semibold">
            Welcome, <span className="text-primary">{user?.fullName}</span>
          </h1>

          <div
            className={`
              w-fit mt-1 px-2 py-0.5
              flex items-center gap-1
              rounded-full text-xs font-medium
              ${role.bg} ${role.color}
            `}
          >
            <RoleIcon className="h-3 w-3" />
            {role.label}
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-3">
        {/* Desktop theme toggle */}
        <div className="hidden md:block">
          <ThemeToggle />
        </div>

        {/* PROFILE DROPDOWN */}
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 rounded-lg px-2 py-2"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-primary text-white font-semibold">
                  {user?.fullName?.[0]}
                </AvatarFallback>
              </Avatar>

              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  open ? "rotate-180" : ""
                }`}
              />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-72 rounded-xl"
          >
            {/* =========================
                TOP USER 👤 INFO
            ========================== */}
            <DropdownMenuLabel>
              <div className="flex items-center gap-3 py-2">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-primary text-white text-lg font-bold">
                    {user?.fullName?.[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="overflow-hidden">
                  <p className="font-semibold truncate">{user?.fullName}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`
                        px-2 py-0.5 rounded-full text-xs font-medium
                        ${role.bg} ${role.color}
                      `}
                    >
                      {user?.role?.toLowerCase()}
                    </span>

                    {user?.hospital && (
                      <span
                        className="
                          px-2 py-0.5 rounded-full text-xs font-medium
                          bg-primary/10 text-primary flex items-center gap-1
                        "
                      >
                        <Building2 className="h-3 w-3" />
                        {user?.hospital}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* =========================
                Quick Links
            ========================== */}
            <DropdownMenuItem asChild>
              <Link
                to="/dashboard"
                className="flex items-center gap-3 py-2"
              >
                <LayoutDashboard className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                to="/dashboard/profile"
                className="flex items-center gap-3 py-2"
              >
                <User className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Profile</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                to="/dashboard/settings"
                className="flex items-center gap-3 py-2"
              >
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Settings</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* =========================
                Logout
            ========================== */}
            <DropdownMenuItem
              className="text-destructive focus:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium">Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
