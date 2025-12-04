import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useAppointments } from '@/hooks/useAppointments'
import { useHealthRecords } from '@/hooks/useHealthRecords'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { CalendarDays, Stethoscope, FileText, Clock, TrendingUp, Users } from 'lucide-react'
import AppointmentCard from '@/components/appointments/AppointmentCard'
import HealthRecordCard from '@/components/health-records/HealthRecordCard'
import DashboardHeader from '@/components/dashboard/DashboardHeader'


const PatientDashboard = () => {
  const { user } = useAuth()
  const { appointments, loading: appointmentsLoading, fetchAppointments } = useAppointments()
  const { healthRecords, loading: recordsLoading, fetchHealthRecords } = useHealthRecords()
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    completedAppointments: 0,
    totalRecords: 0,
    activePrescriptions: 0
  })

  useEffect(() => {
    fetchAppointments()
    fetchHealthRecords()
  }, [])

  useEffect(() => {
    if (appointments && healthRecords) {
      const upcoming = appointments.filter(apt => 
        apt.status === 'Scheduled' || apt.status === 'Confirmed'
      ).length
      
      const completed = appointments.filter(apt => 
        apt.status === 'Completed'
      ).length
      
      const activeRx = healthRecords.flatMap(record => 
        record.prescriptions || []
      ).length

      setStats({
        upcomingAppointments: upcoming,
        completedAppointments: completed,
        totalRecords: healthRecords.length,
        activePrescriptions: activeRx
      })
    }
  }, [appointments, healthRecords])

  const upcomingAppointments = appointments?.filter(apt => 
    apt.status === 'Scheduled' || apt.status === 'Confirmed'
  ).slice(0, 3) || []

  const recentRecords = healthRecords?.slice(0, 3) || []

  return (
    <div className="container mx-auto px-4 py-8">

      <DashboardHeader />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.fullName?.split(' ')[0]}!</h1>
        <p className="text-muted-foreground">Here's your health overview and upcoming activities.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Appointments</p>
                <h3 className="text-2xl font-bold">{stats.upcomingAppointments}</h3>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <CalendarDays className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Visits</p>
                <h3 className="text-2xl font-bold">{stats.completedAppointments}</h3>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Health Records</p>
                <h3 className="text-2xl font-bold">{stats.totalRecords}</h3>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Prescriptions</p>
                <h3 className="text-2xl font-bold">{stats.activePrescriptions}</h3>
              </div>
              <div className="p-3 rounded-lg bg-purple-500/10">
                <Stethoscope className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="appointments" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="records">Health Records</TabsTrigger>
          <TabsTrigger value="ai-chat">AI Assistant</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
            <Button asChild>
              <Link to="/appointments/new">Book Appointment</Link>
            </Button>
          </div>

          {appointmentsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : upcomingAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingAppointments.map((appointment, index) => (
                <motion.div
                  key={appointment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <AppointmentCard appointment={appointment} />
                </motion.div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CalendarDays className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No upcoming appointments</h3>
                <p className="text-muted-foreground mb-4">Schedule your first appointment with a doctor</p>
                <Button asChild>
                  <Link to="/appointments/new">Book Appointment</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="records" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Health Records</h2>
            <Button variant="outline" asChild>
              <Link to="/health-records">View All</Link>
            </Button>
          </div>

          {recordsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : recentRecords.length > 0 ? (
            <div className="space-y-4">
              {recentRecords.map((record, index) => (
                <motion.div
                  key={record._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <HealthRecordCard record={record} />
                </motion.div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No health records yet</h3>
                <p className="text-muted-foreground">Your health records will appear here after doctor visits</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ai-chat">
          <Card>
            <CardHeader>
              <CardTitle>AI Health Assistant</CardTitle>
              <CardDescription>
                Get instant answers to your health questions (for informational purposes only)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Stethoscope className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">CareSync AI Assistant</h3>
                <p className="text-muted-foreground mb-6">
                  Ask general health questions, get wellness tips, and understand medical terms
                </p>
                <Button asChild size="lg" className="cta-gradient text-accent-foreground">
                  <Link to="/ai-chat">Start Chat</Link>
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Note: This is not a substitute for professional medical advice
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you might want to perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="h-auto py-4">
              <Link to="/appointments/new" className="flex flex-col items-center gap-2">
                <CalendarDays className="w-6 h-6" />
                <span>Book Appointment</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4">
              <Link to="/health-records" className="flex flex-col items-center gap-2">
                <FileText className="w-6 h-6" />
                <span>View Records</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4">
              <Link to="/ai-chat" className="flex flex-col items-center gap-2">
                <Stethoscope className="w-6 h-6" />
                <span>AI Assistant</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PatientDashboard