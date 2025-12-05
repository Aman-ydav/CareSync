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
  DropdownMenuLabel,
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
  Home,
  Shield,
  BadgeCheck,
  ChevronDown,
} from "lucide-react";

const Header = ({ onMenuToggle }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => dispatch(logoutUser());

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/login", label: "Services", icon: Shield },
  ];

  return (
    <header
      className="
        fixed top-0 left-0 right-0
        z-50
        h-16 sm:h-20
        border-b border-border/40
        bg-white/80 dark:bg-card/80
        backdrop-blur-xl
        shadow-sm
        transition-all duration-300
      "
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={onMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="
              h-10 w-10
              flex items-center justify-center
              rounded-xl
              bg-linear-to-br from-primary to-primary/70
              shadow-lg shadow-primary/20
              group-hover:shadow-primary/30
              transition-all duration-300
            ">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="
                text-lg sm:text-xl font-bold
                bg-linear-to-r from-primary to-sky-600
                bg-clip-text text-transparent
                leading-tight
              ">
                CareSync
              </span>
              <span className="
                text-[10px] sm:text-xs
                text-muted-foreground
                font-medium
              ">
                Apollo Digital Healthcare
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-2
                px-4 py-2
                rounded-lg
                text-sm font-medium
                transition-all duration-200
                group
                ${
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }
              `}
            >
              <item.icon className={`h-4 w-4 ${
                location.pathname === item.path 
                  ? "text-primary" 
                  : "text-muted-foreground group-hover:text-foreground"
              }`} />
              {item.label}
              {item.path === "/" && location.pathname === item.path && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Theme Toggle */}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              {/* Premium Badge */}
              {user.role === "premium" && (
                <div className="
                  hidden sm:flex
                  items-center gap-1
                  px-3 py-1.5
                  rounded-full
                  bg-linear-to-r from-amber-500 to-orange-500
                  text-white
                  text-xs font-semibold
                  shadow-lg shadow-amber-500/20
                ">
                  <BadgeCheck className="h-3 w-3" />
                  Premium
                </div>
              )}

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="
                      flex items-center gap-2
                      px-3 py-2
                      rounded-xl
                      hover:bg-muted
                      transition-all duration-200
                      group
                    "
                  >
                    <div className="relative">
                      <Avatar className="h-9 w-9 border-2 border-white/50 shadow-md">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="
                          bg-linear-to-br from-primary to-sky-600
                          text-white
                        ">
                          {user.fullName?.charAt(0) || <User />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="
                        absolute -bottom-0.5 -right-0.5
                        h-3 w-3
                        rounded-full
                        bg-green-500
                        border-2 border-white 
                      " />
                    </div>
                    <div className="hidden lg:flex flex-col items-start">
                      <span className="text-sm font-semibold text-foreground">
                        {user.fullName?.split(" ")[0] || "User"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                      </span>
                    </div>
                    <ChevronDown className="
                      h-4 w-4
                      text-muted-foreground
                      group-data-[state=open]:rotate-180
                      transition-transform duration-200
                    " />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="
                    w-64
                    p-2
                    rounded-xl
                    border border-border
                    bg-white dark:bg-card
                    shadow-xl
                  "
                >
                  {/* User Info Section */}
                  <DropdownMenuLabel className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="
                          bg-linear-to-br from-primary to-sky-600
                          text-white
                          text-lg
                        ">
                          {user.fullName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="
                          text-sm font-semibold text-foreground
                          truncate
                        ">
                          {user.fullName}
                        </p>
                        <p className="
                          text-xs text-muted-foreground
                          truncate
                        ">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="my-1" />

                  {/* Menu Items */}
                  <div className="space-y-1">
                    <DropdownMenuItem asChild className="
                      rounded-lg
                      cursor-pointer
                      focus:bg-primary/10
                      focus:text-primary
                    ">
                      <Link to="/dashboard" className="flex items-center gap-3 w-full">
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
                            View your health data
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
                      <Link to="/dashboard/profile" className="flex items-center gap-3 w-full">
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
                            Manage your account
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
                      <Link to="/dashboard/settings" className="flex items-center gap-3 w-full">
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
                            Preferences & privacy
                          </p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  </div>

                  <DropdownMenuSeparator className="my-2" />

                  {/* Logout */}
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
                    <div className="flex items-center gap-3 w-full">
                      <div className="
                        h-9 w-9
                        rounded-lg
                        bg-destructive/10
                        flex items-center justify-center
                      ">
                        <LogOut className="h-4 w-4 text-destructive" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Logout</p>
                        <p className="text-xs text-muted-foreground">
                          Sign out from your account
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="
                  px-4
                  text-sm font-medium
                  text-muted-foreground
                  hover:text-foreground
                "
              >
                <Link to="/login">Sign In</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="
                  px-5
                  bg-linear-to-r from-primary to-primary/80
                  hover:from-primary/90 hover:to-primary/70
                  text-white
                  shadow-lg shadow-primary/20
                  hover:shadow-primary/30
                  transition-all duration-300
                "
              >
                <Link to="/register">
                  Get Started
                  <ChevronDown className="ml-1 h-4 w-4 rotate-90" />
                </Link>
              </Button>
            </div>
          )}

          {/* Mobile Theme Toggle */}
          <div className="sm:hidden">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;