import { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'

const AppointmentCalendar = ({ appointments = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [appointmentsByDate, setAppointmentsByDate] = useState({})

  useEffect(() => {
    // Group appointments by date
    const grouped = {}
    appointments.forEach(appointment => {
      if (appointment.date) {
        const date = format(new Date(appointment.date), 'yyyy-MM-dd')
        if (!grouped[date]) {
          grouped[date] = []
        }
        grouped[date].push(appointment)
      }
    })
    setAppointmentsByDate(grouped)
  }, [appointments])

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getAppointmentsForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return appointmentsByDate[dateStr] || []
  }

  const getAppointmentStatusCount = (date) => {
    const apps = getAppointmentsForDate(date)
    const confirmed = apps.filter(a => a.status === 'Confirmed').length
    const pending = apps.filter(a => a.status === 'Pending').length
    const scheduled = apps.filter(a => a.status === 'Scheduled').length
    return { confirmed, pending, scheduled, total: apps.length }
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Appointment Calendar</CardTitle>
            <CardDescription>
              View and manage your appointments by date
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth(-1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={goToToday}>
              {format(currentDate, 'MMMM yyyy')}
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth(1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Calendar Grid */}
        <div className="mb-4 grid grid-cols-7 gap-1 text-center text-sm font-medium text-muted-foreground">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: monthStart.getDay() }).map((_, i) => (
            <div key={`empty-start-${i}`} className="h-24 p-2 border rounded-lg bg-muted/20"></div>
          ))}

          {monthDays.map(day => {
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isTodayDate = isToday(day)
            const stats = getAppointmentStatusCount(day)
            
            return (
              <div
                key={day.toISOString()}
                className={`h-24 p-2 border rounded-lg flex flex-col ${
                  isCurrentMonth ? 'bg-background' : 'bg-muted/20'
                } ${isTodayDate ? 'border-primary border-2' : ''}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-sm font-medium ${
                    isTodayDate ? 'text-primary' : 'text-foreground'
                  }`}>
                    {format(day, 'd')}
                  </span>
                  {stats.total > 0 && (
                    <Badge variant="outline" className="h-5 text-xs">
                      {stats.total}
                    </Badge>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto space-y-1">
                  {stats.confirmed > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs">{stats.confirmed} confirmed</span>
                    </div>
                  )}
                  {stats.scheduled > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-xs">{stats.scheduled} scheduled</span>
                    </div>
                  )}
                  {stats.pending > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span className="text-xs">{stats.pending} pending</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {Array.from({ length: 6 - monthEnd.getDay() }).map((_, i) => (
            <div key={`empty-end-${i}`} className="h-24 p-2 border rounded-lg bg-muted/20"></div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Legend</h4>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs">Confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs">Scheduled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-xs">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-primary"></div>
              <span className="text-xs">Today</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default AppointmentCalendar