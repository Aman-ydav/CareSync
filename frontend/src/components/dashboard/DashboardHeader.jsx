import { useDispatch } from "react-redux";
import { useAuth } from "@/hooks/useAuth";
import { logoutUser } from "@/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, User, LogOut, Settings, LayoutDashboard } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

const DashboardHeader = ({ onToggleSidebar }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <header className="flex items-center justify-between border-b bg-background/90 px-4 py-4 backdrop-blur">
      
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border md:hidden"
          onClick={onToggleSidebar}
        >
          <Menu className="h-4 w-4" />
        </button>
        <div>
          <p className="text-sm font-semibold">
            Welcome, {user?.fullName || "User"}
          </p>
          <p className="text-xs text-muted-foreground">
            {user?.role === "ADMIN"
              ? "Admin Dashboard"
              : user?.role === "DOCTOR"
              ? "Doctor Panel"
              : "Patient Portal"}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        <ThemeToggle />

        {/* Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 h-9 w-9 rounded-full mr-10">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.avatar} alt={user?.fullName} />
                <AvatarFallback>
                  {user?.fullName?.charAt(0)?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-60 bg-muted/95">
            
            {/* User Info */}
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{user?.fullName}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>

            <DropdownMenuSeparator />


            {/* Profile */}
            <DropdownMenuItem asChild>
              <Link to="/dashboard/profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>

            {/* Settings */}
            <DropdownMenuItem asChild>
              <Link to="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Logout */}
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>

    </header>
  );
};

export default DashboardHeader;
