import { useDispatch } from "react-redux";
import { useAuth } from "@/hooks/useAuth";
import { logoutUser } from "@/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Bell, LogOut, Menu } from "lucide-react";

const DashboardHeader = ({ onToggleSidebar }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <header className="w-full border-b bg-background/80 backdrop-blur px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button
          className="md:hidden p-2 rounded-md border border-border"
          onClick={onToggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>
        <div>
          <p className="text-sm font-semibold">Welcome, {user?.fullName || "User"}</p>
          <p className="text-xs text-muted-foreground">
            {user?.role === "ADMIN"
              ? "Admin Dashboard"
              : user?.role === "DOCTOR"
              ? "Doctor Panel"
              : "Patient Portal"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-full border border-border hover:bg-muted">
          <Bell className="w-4 h-4" />
        </button>
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-1 text-xs"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
