import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, Hospital, Calendar, FileText, TrendingUp, Activity } from 'lucide-react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalHospitals: 0,
    todayAppointments: 0,
    activeRecords: 0
  })

  // In a real app, you would fetch these from your API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalUsers: 1245,
        totalDoctors: 45,
        totalPatients: 1200,
        totalHospitals: 12,
        todayAppointments: 67,
        activeRecords: 890
      })
    }, 500)
  }, [])

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
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage the CareSync platform and view system analytics</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <h3 className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</h3>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Doctors</p>
                <p className="font-semibold">{stats.totalDoctors}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Patients</p>
                <p className="font-semibold">{stats.totalPatients}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hospitals</p>
                <h3 className="text-2xl font-bold">{stats.totalHospitals}</h3>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10">
                <Hospital className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <Button variant="ghost" size="sm" className="mt-4 w-full" asChild>
              <Link to="/hospitals">Manage Hospitals</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Appointments</p>
                <h3 className="text-2xl font-bold">{stats.todayAppointments}</h3>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <Button variant="ghost" size="sm" className="mt-4 w-full" asChild>
              <Link to="/appointments">View All</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full max-w-xl grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Platform status and performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>API Status</span>
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Operational
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Database</span>
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Storage</span>
                  <span className="text-muted-foreground">78% used</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Active Sessions</span>
                  <span className="text-muted-foreground">124</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { time: '2 min ago', event: 'New user registration', user: 'John Doe' },
                    { time: '5 min ago', event: 'Appointment booked', user: 'Dr. Smith' },
                    { time: '15 min ago', event: 'Health record created', user: 'Dr. Johnson' },
                    { time: '1 hour ago', event: 'Hospital added', user: 'Admin' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.event}</p>
                        <p className="text-xs text-muted-foreground">{activity.time} • {activity.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">User Management</h3>
                    <p className="text-sm text-muted-foreground">Manage all users, doctors, and patients</p>
                  </div>
                  <Button asChild className="w-full">
                    <Link to="/admin/users">Manage Users</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <Hospital className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Hospital Management</h3>
                    <p className="text-sm text-muted-foreground">Add, edit, or remove hospitals</p>
                  </div>
                  <Button asChild className="w-full">
                    <Link to="/hospitals">Manage Hospitals</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <FileText className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">System Settings</h3>
                    <p className="text-sm text-muted-foreground">Configure platform settings</p>
                  </div>
                  <Button asChild className="w-full">
                    <Link to="/admin/settings">Configure</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Platform Analytics</CardTitle>
              <CardDescription>Growth and usage statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">User Growth</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">This Week</span>
                      <span className="font-semibold text-green-600">+12%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">This Month</span>
                      <span className="font-semibold text-green-600">+45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">This Year</span>
                      <span className="font-semibold text-green-600">+230%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Engagement Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Avg. Sessions</span>
                      <span className="font-semibold">3.2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Appointment Rate</span>
                      <span className="font-semibold">78%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Retention</span>
                      <span className="font-semibold">92%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="font-semibold mb-4">Quick Actions</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" asChild>
                    <Link to="/admin/reports">Generate Reports</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/admin/backup">Backup Data</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/admin/audit">View Audit Log</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminDashboard