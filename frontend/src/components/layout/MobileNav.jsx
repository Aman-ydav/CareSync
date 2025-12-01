import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { logoutUser } from '@/features/auth/authSlice'
import { X, User, LogOut, Stethoscope, Calendar, FileText, Home } from 'lucide-react'

const MobileNav = ({ onClose }) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logoutUser())
    onClose()
  }

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: Stethoscope },
    { path: '/appointments', label: 'Appointments', icon: Calendar },
    { path: '/medical-records', label: 'Records', icon: FileText },
  ]

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed top-0 right-0 bottom-0 w-80 bg-card border-l z-50 lg:hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg medical-gradient flex items-center justify-center">
            <Stethoscope className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">CareSync</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.fullName} />
              <AvatarFallback>
                {user.fullName?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user.fullName}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role?.toLowerCase()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Auth Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
        {user ? (
          <div className="space-y-2">
            <Button asChild variant="outline" className="w-full" onClick={onClose}>
              <Link to="/profile">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Link>
            </Button>
            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Button asChild variant="outline" className="w-full" onClick={onClose}>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild className="w-full cta-gradient text-accent-foreground" onClick={onClose}>
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default MobileNav