import { useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, User, Stethoscope, Calendar, MoreVertical, Pill } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const HealthRecordCard = ({ record, showPatient = false, showActions = false, compact = false, onAction }) => {
  const [loading, setLoading] = useState(false)

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-500'
      case 'Archived': return 'bg-gray-500'
      case 'Deleted': return 'bg-red-500'
      default: return 'bg-gray-500'
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
        await onAction(record._id, action)
      } finally {
        setLoading(false)
      }
    }
  }

  if (compact) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h4 className="font-semibold text-sm line-clamp-1">{record.diagnosis}</h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(record.visitDate)}</span>
                {record.prescriptions?.length > 0 && (
                  <>
                    <span>•</span>
                    <Pill className="w-3 h-3" />
                    <span>{record.prescriptions.length} prescriptions</span>
                  </>
                )}
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={`text-xs ${getStatusColor(record.status)} text-white border-0`}
            >
              {record.status}
            </Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">
                <FileText className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{record.diagnosis}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                {formatDate(record.visitDate)}
                {record.followUpDate && (
                  <>
                    <span>•</span>
                    <span>Follow-up: {formatDate(record.followUpDate)}</span>
                  </>
                )}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`${getStatusColor(record.status)} text-white border-0`}
            >
              {record.status}
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
                    <Link to={`/health-records/${record._id}`}>View Details</Link>
                  </DropdownMenuItem>
                  {showPatient && (
                    <DropdownMenuItem asChild>
                      <Link to={`/health-records?patient=${record.patient?._id}`}>
                        View All Records
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {record.status === 'Active' && (
                    <DropdownMenuItem onClick={() => handleAction('archive')}>
                      Archive
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to={`/health-records/${record._id}/edit`}>Edit</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Doctor and Patient Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={record.doctor?.avatar} />
              <AvatarFallback>
                {record.doctor?.fullName?.charAt(0)?.toUpperCase() || <Stethoscope className="w-3 h-3" />}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Dr. {record.doctor?.fullName}</p>
              <p className="text-xs text-muted-foreground">{record.doctor?.specialty}</p>
            </div>
          </div>

          {showPatient && record.patient && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">{record.patient.fullName}</p>
                <p className="text-xs text-muted-foreground">Patient</p>
              </div>
              <Avatar className="h-8 w-8">
                <AvatarImage src={record.patient.avatar} />
                <AvatarFallback>
                  {record.patient.fullName?.charAt(0)?.toUpperCase() || <User className="w-3 h-3" />}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>

        {/* Hospital and Prescriptions */}
        <div className="grid grid-cols-2 gap-4">
          {record.hospital && (
            <div>
              <p className="text-xs text-muted-foreground">Hospital</p>
              <p className="text-sm font-medium">{record.hospital.name}</p>
            </div>
          )}
          
          {record.prescriptions && record.prescriptions.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground">Prescriptions</p>
              <p className="text-sm font-medium">{record.prescriptions.length} medications</p>
            </div>
          )}
        </div>

        {/* Vital Signs Preview */}
        {record.vitalSigns && (
          <div className="pt-3 border-t">
            <p className="text-xs text-muted-foreground mb-2">Vital Signs</p>
            <div className="flex gap-4">
              {record.vitalSigns.bloodPressure && (
                <div>
                  <p className="text-xs text-muted-foreground">BP</p>
                  <p className="text-sm font-medium">{record.vitalSigns.bloodPressure}</p>
                </div>
              )}
              {record.vitalSigns.heartRate && (
                <div>
                  <p className="text-xs text-muted-foreground">HR</p>
                  <p className="text-sm font-medium">{record.vitalSigns.heartRate} bpm</p>
                </div>
              )}
              {record.vitalSigns.temperature && (
                <div>
                  <p className="text-xs text-muted-foreground">Temp</p>
                  <p className="text-sm font-medium">{record.vitalSigns.temperature}°F</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>

      {showActions && (
        <CardFooter className="pt-0">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link to={`/health-records/${record._id}`}>View Full Record</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

export default HealthRecordCard