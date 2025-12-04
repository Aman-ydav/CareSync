import { useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, Clock, MapPin, User, Video, Phone, MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const AppointmentCard = ({ appointment, showPatient = false, showActions = false, onAction }) => {
  const [loading, setLoading] = useState(false)

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-500'
      case 'Scheduled': return 'bg-blue-500'
      case 'Pending': return 'bg-yellow-500'
      case 'Completed': return 'bg-gray-500'
      case 'Cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'Confirmed': return 'Confirmed'
      case 'Scheduled': return 'Scheduled'
      case 'Pending': return 'Pending'
      case 'Completed': return 'Completed'
      case 'Cancelled': return 'Cancelled'
      default: return status
    }
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return format(date, 'MMM dd, yyyy')
    } catch (error) {
      return 'Invalid date'
    }
  }

  const handleAction = async (action) => {
    if (onAction) {
      setLoading(true)
      try {
        await onAction(appointment._id, action)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="premium-card rounded-xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={showPatient ? appointment.patient?.avatar : appointment.doctor?.avatar} />
            <AvatarFallback>
              {showPatient 
                ? appointment.patient?.fullName?.charAt(0)?.toUpperCase() || <User className="w-6 h-6" />
                : appointment.doctor?.fullName?.charAt(0)?.toUpperCase() || <User className="w-6 h-6" />
              }
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">
              {showPatient ? appointment.patient?.fullName : `Dr. ${appointment.doctor?.fullName}`}
            </h3>
            <p className="text-sm text-muted-foreground">
              {showPatient ? 'Patient' : appointment.doctor?.specialty || 'Doctor'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`${getStatusColor(appointment.status)} text-white border-0`}>
            {getStatusText(appointment.status)}
          </Badge>
          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/appointments/${appointment._id}`}>View Details</Link>
                </DropdownMenuItem>
                {appointment.status === 'Pending' && (
                  <DropdownMenuItem onClick={() => handleAction('confirm')}>
                    Confirm
                  </DropdownMenuItem>
                )}
                {['Pending', 'Scheduled', 'Confirmed'].includes(appointment.status) && (
                  <DropdownMenuItem onClick={() => handleAction('cancel')}>
                    Cancel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={`/appointments/${appointment._id}/edit`}>Edit</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>{formatDate(appointment.date)}</span>
          <Clock className="w-4 h-4 text-muted-foreground ml-2" />
          <span>{appointment.time}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span>{appointment.hospitalName}</span>
        </div>

        {appointment.consultationType === 'Teleconsultation' && (
          <div className="flex items-center gap-2 text-sm">
            {appointment.meetingLink ? (
              <>
                <Video className="w-4 h-4 text-blue-500" />
                <a 
                  href={appointment.meetingLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Join Video Call
                </a>
              </>
            ) : (
              <>
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>Teleconsultation</span>
              </>
            )}
          </div>
        )}

        <div className="pt-3 border-t">
          <p className="text-sm text-muted-foreground line-clamp-2">{appointment.reason}</p>
        </div>

        {showActions && (
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/appointments/${appointment._id}`}>Details</Link>
            </Button>
            {appointment.status === 'Pending' && (
              <Button size="sm" onClick={() => handleAction('confirm')} disabled={loading}>
                Confirm
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AppointmentCard