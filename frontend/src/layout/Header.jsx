import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { logoutUser } from "@/features/auth/authSlice";
import {
  Menu,
  Stethoscope,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
} from "lucide-react";

const Header = ({ onMenuToggle }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => dispatch(logoutUser());

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
  ];

  return (
    <header
      className="
        fixed top-0 left-0 right-0
        z-50
        h-16
        border-b
        bg-background/85
        backdrop-blur-xl
      "
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-primary/10">
            <Stethoscope className="h-4 w-4 text-primary" />
          </div>
          <span className="bg-linear-to-r from-primary to-sky-500 bg-clip-text text-xl font-bold text-transparent">
            CareSync
          </span>
        </Link>

        {/* Desktop */}
        <nav className="hidden gap-6 md:flex">
          {navItems.map(n => (
            <Link
              key={n.path}
              to={n.path}
              className={`text-sm font-medium hover:text-primary ${
                location.pathname === n.path
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.fullName?.charAt(0) || <User />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-60">
                
                {/* User Info */}
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{user.fullName}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
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
          ) : (
            <div className="hidden gap-2 md:flex">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          )}

          {/* Mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
