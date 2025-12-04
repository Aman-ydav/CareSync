import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useAppointments } from '@/hooks/useAppointments'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { CalendarDays, Users, Clock, TrendingUp, Stethoscope, UserCheck } from 'lucide-react'
import AppointmentCard from '@/components/appointments/AppointmentCard'
import DashboardHeader from '@/components/dashboard/DashboardHeader'


const DoctorDashboard = () => {
  const { user } = useAuth()
  const { appointments, loading, fetchAppointments } = useAppointments()
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingAppointments: 0,
    totalPatients: 0,
    completionRate: 0
  })

  useEffect(() => {
    fetchAppointments()
  }, [])

  useEffect(() => {
    if (appointments) {
      const today = new Date().toISOString().split('T')[0]
      const todayApts = appointments.filter(apt => 
        apt.date && apt.date.toString().startsWith(today)
      )
      
      const pending = appointments.filter(apt => 
        apt.status === 'Pending'
      ).length

      // Get unique patients
      const patientIds = [...new Set(appointments.map(apt => apt.patient?._id).filter(Boolean))]
      
      setStats({
        todayAppointments: todayApts.length,
        pendingAppointments: pending,
        totalPatients: patientIds.length,
        completionRate: appointments.length > 0 ? 
          Math.round((appointments.filter(apt => apt.status === 'Completed').length / appointments.length) * 100) : 0
      })
    }
  }, [appointments])

  const todayAppointments = appointments?.filter(apt => {
    if (!apt.date) return false
    const today = new Date().toISOString().split('T')[0]
    return apt.date.toString().startsWith(today)
  }).slice(0, 5) || []

  const upcomingAppointments = appointments?.filter(apt => 
    apt.status === 'Scheduled' || apt.status === 'Confirmed'
  ).slice(0, 5) || []

  return (
    <div className="container mx-auto px-4 py-8">

      <DashboardHeader/>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, Dr. {user?.fullName?.split(' ')[0]}!</h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize">{user?.specialty}</Badge>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{user?.hospitalName || 'Hospital'}</span>
            </div>
          </div>
          <Button asChild>
            <Link to="/appointments/new">Schedule Appointment</Link>
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Appointments</p>
                <h3 className="text-2xl font-bold">{stats.todayAppointments}</h3>
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
                <p className="text-sm text-muted-foreground">Pending Approvals</p>
                <h3 className="text-2xl font-bold">{stats.pendingAppointments}</h3>
              </div>
              <div className="p-3 rounded-lg bg-yellow-500/10">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Patients</p>
                <h3 className="text-2xl font-bold">{stats.totalPatients}</h3>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10">
                <Users className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <h3 className="text-2xl font-bold">{stats.completionRate}%</h3>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="today" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Today's Schedule</h2>
            <Button variant="outline" asChild>
              <Link to="/appointments">View All</Link>
            </Button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : todayAppointments.length > 0 ? (
            <div className="space-y-4">
              {todayAppointments.map((appointment, index) => (
                <motion.div
                  key={appointment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <AppointmentCard appointment={appointment} showPatient={true} />
                </motion.div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CalendarDays className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No appointments today</h3>
                <p className="text-muted-foreground">Enjoy your day or schedule new appointments</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
            <Button variant="outline" asChild>
              <Link to="/appointments">View Calendar</Link>
            </Button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment, index) => (
                <motion.div
                  key={appointment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <AppointmentCard appointment={appointment} showPatient={true} />
                </motion.div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CalendarDays className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No upcoming appointments</h3>
                <p className="text-muted-foreground mb-4">Schedule new appointments with patients</p>
                <Button asChild>
                  <Link to="/appointments/new">Schedule Now</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="patients">
          <Card>
            <CardHeader>
              <CardTitle>Patient Management</CardTitle>
              <CardDescription>
                Manage your patients and their health records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Stethoscope className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Health Records</h3>
                        <p className="text-sm text-muted-foreground">Create and update patient records</p>
                      </div>
                    </div>
                    <Button asChild className="w-full">
                      <Link to="/health-records/new">Create Record</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-green-500/10">
                        <UserCheck className="w-6 h-6 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Patient List</h3>
                        <p className="text-sm text-muted-foreground">View all your patients</p>
                      </div>
                    </div>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/patients">View Patients</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Consultation Hours</CardTitle>
          </CardHeader>
          <CardContent>
            {user?.consultationHours ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start:</span>
                  <span className="font-medium">{user.consultationHours.start}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">End:</span>
                  <span className="font-medium">{user.consultationHours.end}</span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Not set</p>
            )}
            <Button variant="ghost" size="sm" className="mt-4 w-full">
              Edit Hours
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Specialty</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="mb-2">{user?.specialty || 'General'}</Badge>
            <p className="text-sm text-muted-foreground mt-2">
              {user?.qualification || 'Medical Professional'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">Available for appointments</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-sm">Teleconsultation available</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="mt-4 w-full">
              Update Status
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DoctorDashboard