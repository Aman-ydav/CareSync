import { useDispatch } from "react-redux";
import { useAuth } from "@/hooks/useAuth";
import { logoutUser } from "@/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Menu, 
  User, 
  LogOut, 
  Settings, 
  LayoutDashboard,
  ChevronDown,
  Shield,
  Bell,
  HelpCircle,
  BadgeCheck,
  Building2
} from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useState } from "react";

const DashboardHeader = ({ onToggleSidebar }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const roleConfig = {
    ADMIN: {
      title: "Admin Dashboard",
      icon: Shield,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    DOCTOR: {
      title: "Doctor Panel",
      icon: User,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    PATIENT: {
      title: "Patient Portal",
      icon: User,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
  };

  const config = roleConfig[user?.role] || roleConfig.PATIENT;
  const RoleIcon = config.icon;

  return (
    <header className="
      sticky top-0
      z-40
      flex items-center justify-between
      border-b border-border/40
      bg-white/70 dark:bg-card/80
      px-6 py-2
      backdrop-blur-xl
      shadow-sm
    ">
      
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onToggleSidebar}
          className="
            md:hidden
            h-10 w-10
            flex items-center justify-center
            rounded-xl
            bg-muted/50
            hover:bg-muted
            transition-all duration-200
            group
          "
        >
          <Menu className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
        </button>

        {/* Welcome Section */}
        <div className="flex items-center gap-4">
          
          
          <div>
            <h1 className="text-lg font-bold text-foreground">
              <span className="text-primary">{user?.fullName || "User"}</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`
                px-3 py-1
                rounded-full
                text-xs font-semibold
                ${config.bgColor} ${config.color}
                flex items-center gap-1
              `}>
                <config.icon className="h-3 w-3" />
                {config.title}
              </span>
              
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">       
        
        {/* Theme Toggle */}
        <div className="hidden md:block">
          <ThemeToggle />
        </div>

        {/* User Dropdown */}
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="
                flex items-center gap-3
                px-3 py-2
                rounded-xl
                hover:bg-muted
                transition-all duration-200
                group
              "
            >
              <div className="relative">
                <Avatar className="
                  h-10 w-10
                  border-2 border-white/50
                  shadow-md
                ">
                  <AvatarImage 
                    src={user?.avatar} 
                    alt={user?.fullName} 
                  />
                  <AvatarFallback className="
                    bg-linear-to-br from-primary to-sky-600
                    text-white
                    font-semibold
                  ">
                    {user?.fullName?.charAt(0)?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="
                  absolute -bottom-0.5 -right-0.5
                  h-3 w-3
                  rounded-full
                  bg-green-500
                  border-2 border-background
                " />
              </div>
              
              

              <ChevronDown className={`
                h-4 w-4
                text-muted-foreground
                transition-transform duration-200
                ${isDropdownOpen ? "rotate-180" : "rotate-0"}
                group-hover:text-foreground
              `} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="
              w-72
              p-2
              rounded-xl
              border border-border
              bg-white dark:bg-card
              shadow-xl
            "
          >
            {/* User Header */}
            <DropdownMenuLabel className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border-2 border-white/50 shadow-sm">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="
                    bg-linear-to-br from-primary to-sky-600
                    text-white text-lg font-semibold
                  ">
                    {user?.fullName?.charAt(0)?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="
                    text-base font-bold text-foreground
                    truncate
                  ">
                    {user?.fullName}
                  </h3>
                  <p className="
                    text-sm text-muted-foreground
                    truncate
                  ">
                    {user?.email}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`
                      px-2 py-1
                      rounded-full
                      text-xs font-medium
                      ${config.bgColor} ${config.color}
                    `}>
                      {user?.role?.toLowerCase()}
                    </span>
                    {user?.hospital && (
                      <span className="
                        px-2 py-1
                        rounded-full
                        bg-primary/10
                        text-xs font-medium text-primary
                        flex items-center gap-1
                      ">
                        <Building2 className="h-3 w-3" />
                        {user?.hospital}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="my-2" />

            {/* Quick Links */}
            <div className="space-y-1 px-2">
              <DropdownMenuItem asChild className="
                rounded-lg
                cursor-pointer
                focus:bg-primary/10
                focus:text-primary
              ">
                <Link to="/dashboard" className="flex items-center gap-3 w-full px-3 py-2">
                  <div className="
                    h-9 w-9
                    rounded-lg
                    bg-primary/10
                    flex items-center justify-center
                  ">
                    <LayoutDashboard className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Dashboard</p>
                    <p className="text-xs text-muted-foreground">
                      Overview & analytics
                    </p>
                  </div>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="
                rounded-lg
                cursor-pointer
                focus:bg-primary/10
                focus:text-primary
              ">
                <Link to="/dashboard/profile" className="flex items-center gap-3 w-full px-3 py-2">
                  <div className="
                    h-9 w-9
                    rounded-lg
                    bg-accent/10
                    flex items-center justify-center
                  ">
                    <User className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Profile</p>
                    <p className="text-xs text-muted-foreground">
                      Personal information
                    </p>
                  </div>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="
                rounded-lg
                cursor-pointer
                focus:bg-primary/10
                focus:text-primary
              ">
                <Link to="/dashboard/settings" className="flex items-center gap-3 w-full px-3 py-2">
                  <div className="
                    h-9 w-9
                    rounded-lg
                    bg-muted
                    flex items-center justify-center
                  ">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Settings</p>
                    <p className="text-xs text-muted-foreground">
                      Preferences & security
                    </p>
                  </div>
                </Link>
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator className="my-2" />

            {/* Support & Logout */}
            <div className="space-y-1 px-2">
              

              <DropdownMenuItem
                onClick={handleLogout}
                className="
                  rounded-lg
                  cursor-pointer
                  focus:bg-destructive/10
                  focus:text-destructive
                  text-destructive
                "
              >
                <div className="flex items-center gap-3 w-full px-3 py-2">
                  <div className="
                    h-9 w-9
                    rounded-lg
                    bg-destructive/10
                    flex items-center justify-center
                  ">
                    <LogOut className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Sign Out</p>
                    <p className="text-xs text-muted-foreground">
                      End your session
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;