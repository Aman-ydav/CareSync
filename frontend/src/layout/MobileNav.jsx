import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logoutUser } from "@/features/auth/authSlice";
import {
  X,
  User,
  LogOut,
  Stethoscope,
  Calendar,
  FileText,
  Home,
} from "lucide-react";

const sidebarMotion = {
  initial: { x: "100%", opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 24,
    },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 24,
    },
  },
};

const MobileNav = ({ onClose }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    onClose();
  };

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/dashboard", label: "Dashboard", icon: Stethoscope },
    { path: "/appointments", label: "Appointments", icon: Calendar },
    { path: "/medical-records", label: "Records", icon: FileText },
  ];

  return (
    <motion.div
      {...sidebarMotion}
      className="fixed inset-y-0 right-0 z-50 w-80 border-l bg-card shadow-lg lg:hidden flex flex-col"
    >

      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Stethoscope className="h-4 w-4 text-primary" />
          </div>
          <span className="text-lg font-semibold">CareSync</span>
        </div>

        {/* Cross Button (Animated) */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          className="rounded-full p-1 hover:bg-muted"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </motion.button>
      </div>

      {/* User */}
      {user && (
        <div className="border-b px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.fullName} />
              <AvatarFallback>
                {user.fullName?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.fullName}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {user.role?.toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="space-y-2 px-4 py-4 flex-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              location.pathname === item.path
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Auth */}
      <div className="border-t p-4">
        {user ? (
          <div className="space-y-2">
            <Button
              asChild
              variant="outline"
              className="w-full justify-center"
              onClick={onClose}
            >
              <Link to="/profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </Button>

            <Button
              variant="destructive"
              className="w-full justify-center"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Button
              asChild
              variant="outline"
              className="w-full justify-center"
              onClick={onClose}
            >
              <Link to="/login">Sign In</Link>
            </Button>

            <Button
              asChild
              className="w-full justify-center bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={onClose}
            >
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        )}
      </div>

    </motion.div>
  );
};

export default MobileNav;
