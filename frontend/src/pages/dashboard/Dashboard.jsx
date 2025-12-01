import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import VerificationModal from '@/components/auth/VerificationModal'
import { 
  Stethoscope, 
  Calendar, 
  FileText, 
  Users, 
  Activity, 
  ArrowRight, 
  Clock,
  Pill,
  Heart,
  Bell,
  TrendingUp
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth)

  const stats = [
    { 
      label: "Upcoming Appointments", 
      value: "3", 
      icon: Calendar, 
      color: "text-blue-500",
      change: "+1 this week",
      trend: "up"
    },
    { 
      label: "Medical Records", 
      value: "12", 
      icon: FileText, 
      color: "text-green-500",
      change: "2 new",
      trend: "up"
    },
    { 
      label: "Active Medications", 
      value: "5", 
      icon: Pill, 
      color: "text-purple-500",
      change: "All current",
      trend: "stable"
    },
    { 
      label: "Health Score", 
      value: "92%", 
      icon: Activity, 
      color: "text-orange-500",
      change: "+2% this month",
      trend: "up"
    },
  ]

  const quickActions = [
    { 
      title: "Book Appointment", 
      description: "Schedule a new medical consultation", 
      icon: Calendar, 
      href: "/appointments",
      color: "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400"
    },
    { 
      title: "View Health Records", 
      description: "Access your complete medical history", 
      icon: FileText, 
      href: "/medical-records",
      color: "bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-400"
    },
    { 
      title: "Find Doctors", 
      description: "Browse healthcare specialists", 
      icon: Stethoscope, 
      href: "/doctors",
      color: "bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 dark:text-purple-400"
    },
  ]

  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Chen",
      specialty: "Cardiology",
      date: "Today, 2:30 PM",
      status: "confirmed",
      type: "Follow-up"
    },
    {
      id: 2,
      doctor: "Dr. Michael Rodriguez",
      specialty: "Dermatology",
      date: "Tomorrow, 10:00 AM",
      status: "confirmed",
      type: "Consultation"
    },
    {
      id: 3,
      doctor: "Dr. Emily Watson",
      specialty: "General Practice",
      date: "Dec 15, 3:15 PM",
      status: "scheduled",
      type: "Annual Checkup"
    }
  ]

  const recentActivity = [
    {
      id: 1,
      type: "prescription",
      title: "Prescription Refilled",
      description: "Metformin 500mg - 30 day supply",
      time: "2 hours ago",
      icon: Pill,
      color: "text-green-500 dark:text-green-400"
    },
    {
      id: 2,
      type: "lab_result",
      title: "Lab Results Available",
      description: "Blood test results from December 1st",
      time: "1 day ago",
      icon: FileText,
      color: "text-blue-500 dark:text-blue-400"
    },
    {
      id: 3,
      type: "appointment",
      title: "Appointment Reminder",
      description: "Upcoming appointment with Dr. Chen tomorrow",
      time: "2 days ago",
      icon: Bell,
      color: "text-orange-500 dark:text-orange-400"
    }
  ]

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { variant: "default", label: "Confirmed" },
      scheduled: { variant: "secondary", label: "Scheduled" },
      cancelled: { variant: "destructive", label: "Cancelled" }
    }
    return statusConfig[status] || statusConfig.scheduled
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      {/* Verification Modal */}
      <VerificationModal />
      
      {/* Dashboard Header */}
      <DashboardHeader />
      
      {/* Dashboard Content */}
      <div className="py-8">
        <div className="container mx-auto px-4 space-y-8">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-foreground dark:text-foreground">
                Welcome back, {user?.fullName || 'User'}! 👋
              </h1>
              <p className="text-muted-foreground dark:text-muted-foreground mt-2">
                Here's your health overview for today, {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/80 text-primary-foreground dark:text-primary-foreground font-medium">
              <Link to="/appointments/new" className="flex items-center gap-2">
                Book Appointment <Calendar className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="premium-card hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground dark:text-foreground mt-1">{stat.value}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <TrendingUp className={`w-4 h-4 ${
                            stat.trend === 'up' ? 'text-green-500 dark:text-green-400' : 
                            stat.trend === 'down' ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
                          }`} />
                          <span className={`text-xs ${
                            stat.trend === 'up' ? 'text-green-600 dark:text-green-500' : 
                            stat.trend === 'down' ? 'text-red-600 dark:text-red-500' : 'text-gray-600 dark:text-gray-500'
                          }`}>
                            {stat.change}
                          </span>
                        </div>
                      </div>
                      <div className={`p-3 rounded-xl bg-primary/10 dark:bg-primary/20 ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <h2 className="text-2xl font-bold text-foreground dark:text-foreground mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="premium-card h-full cursor-pointer group border-2 border-transparent hover:border-primary/20 dark:hover:border-primary/30 transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-xl ${action.color}`}>
                            <action.icon className="w-6 h-6" />
                          </div>
                          <ArrowRight className="w-5 h-5 text-muted-foreground dark:text-muted-foreground group-hover:text-primary dark:group-hover:text-primary transition-colors" />
                        </div>
                        <h3 className="font-semibold text-foreground dark:text-foreground mb-2">{action.title}</h3>
                        <p className="text-sm text-muted-foreground dark:text-muted-foreground">{action.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Upcoming Appointments */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground dark:text-foreground">Upcoming Appointments</h2>
                  <Button variant="ghost" size="sm" asChild className="text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:hover:text-foreground">
                    <Link to="/appointments">View All</Link>
                  </Button>
                </div>
                <Card className="premium-card">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => {
                        const status = getStatusBadge(appointment.status)
                        return (
                          <div key={appointment.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 dark:bg-muted/50 hover:bg-muted/70 dark:hover:bg-muted/70 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                                <Stethoscope className="w-6 h-6 text-primary dark:text-primary" />
                              </div>
                              <div>
                                <p className="font-semibold text-foreground dark:text-foreground">{appointment.doctor}</p>
                                <p className="text-sm text-muted-foreground dark:text-muted-foreground">{appointment.specialty} • {appointment.type}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Clock className="w-4 h-4 text-muted-foreground dark:text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground dark:text-muted-foreground">{appointment.date}</span>
                                </div>
                              </div>
                            </div>
                            <Badge variant={status.variant}>{status.label}</Badge>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Recent Activity & Health Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Recent Activity */}
              <div>
                <h2 className="text-2xl font-bold text-foreground dark:text-foreground mb-6">Recent Activity</h2>
                <Card className="premium-card">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 dark:hover:bg-muted/50 transition-colors">
                          <div className={`p-2 rounded-lg ${activity.color} bg-opacity-10 dark:bg-opacity-20 mt-1`}>
                            <activity.icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-foreground dark:text-foreground text-sm">{activity.title}</p>
                            <p className="text-muted-foreground dark:text-muted-foreground text-xs">{activity.description}</p>
                            <p className="text-muted-foreground dark:text-muted-foreground text-xs mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Health Tips */}
              <Card className="premium-card bg-linear-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 border border-border/50 dark:border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground dark:text-foreground">
                    <Heart className="w-5 h-5 text-primary dark:text-primary" />
                    Health Tip of the Day
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground dark:text-foreground mb-3">
                    Stay hydrated! Drinking enough water helps maintain blood pressure and supports kidney function.
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground dark:text-muted-foreground">
                    <span>Recommended: 8 glasses daily</span>
                    <Badge variant="outline" className="border-border dark:border-border text-foreground dark:text-foreground">Wellness</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard