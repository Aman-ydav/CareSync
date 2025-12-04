import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { useAuth } from '@/hooks/useAuth'
import { useHealthRecords } from '@/hooks/useHealthRecords'
import api from '@/api/axiosInterceptor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Calendar, User, Stethoscope, FileText, AlertCircle, ChevronLeft, Edit, Trash2, Hospital, Clock } from 'lucide-react'

const HealthRecordDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isDoctor } = useAuth()
  const { deleteHealthRecord, loading } = useHealthRecords()
  const [record, setRecord] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRecordDetails()
  }, [id])

  const fetchRecordDetails = async () => {
    try {
      setIsLoading(true)
      const response = await api.get(`/health-records/${id}`)
      setRecord(response.data.data)
    } catch (error) {
      toast.error('Failed to fetch health record details')
      navigate('/health-records')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this health record?')) return

    try {
      await deleteHealthRecord(id)
      toast.success('Health record deleted successfully')
      navigate('/health-records')
    } catch (error) {
      toast.error('Failed to delete health record')
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!record) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Health Record Not Found</h2>
        <p className="text-muted-foreground mb-4">The health record you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/health-records">Back to Health Records</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/health-records')}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Health Record</h1>
            <p className="text-muted-foreground">
              {format(new Date(record.visitDate), 'MMMM dd, yyyy')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{record.status}</Badge>
          {isDoctor && (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to={`/health-records/${id}/edit`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDelete}
                disabled={loading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Record Information</CardTitle>
              <CardDescription>Medical consultation details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Doctor and Patient Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" />
                    Doctor
                  </h3>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={record.doctor?.avatar} />
                      <AvatarFallback>
                        {record.doctor?.fullName?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">Dr. {record.doctor?.fullName}</p>
                      <p className="text-sm text-muted-foreground">
                        {record.doctor?.specialty || 'General Physician'}
                      </p>
                      {record.doctor?.qualification && (
                        <p className="text-xs text-muted-foreground">{record.doctor.qualification}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Patient
                  </h3>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={record.patient?.avatar} />
                      <AvatarFallback>
                        {record.patient?.fullName?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{record.patient?.fullName}</p>
                      <p className="text-sm text-muted-foreground">Patient</p>
                      {record.patient?.bloodGroup && (
                        <p className="text-xs text-muted-foreground">
                          Blood Group: {record.patient.bloodGroup}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Hospital and Dates */}
              <div className="grid grid-cols-2 gap-6">
                {record.hospital && (
                  <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Hospital className="w-4 h-4" />
                      Hospital/Clinic
                    </h3>
                    <p className="text-muted-foreground">{record.hospital?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {record.hospital?.city}, {record.hospital?.state}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Visit Date
                  </h3>
                  <p className="text-muted-foreground">
                    {format(new Date(record.visitDate), 'PPP')}
                  </p>
                </div>

                {record.followUpDate && (
                  <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Follow-up Date
                    </h3>
                    <p className="text-muted-foreground">
                      {format(new Date(record.followUpDate), 'PPP')}
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Diagnosis */}
              <div className="space-y-4">
                <h3 className="font-semibold">Diagnosis</h3>
                <p className="text-muted-foreground">{record.diagnosis}</p>
              </div>

              {/* Vital Signs */}
              {record.vitalSigns && Object.values(record.vitalSigns).some(v => v) && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="font-semibold">Vital Signs</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {record.vitalSigns.bloodPressure && (
                        <div>
                          <p className="text-sm text-muted-foreground">Blood Pressure</p>
                          <p className="font-medium">{record.vitalSigns.bloodPressure}</p>
                        </div>
                      )}
                      {record.vitalSigns.heartRate && (
                        <div>
                          <p className="text-sm text-muted-foreground">Heart Rate</p>
                          <p className="font-medium">{record.vitalSigns.heartRate} bpm</p>
                        </div>
                      )}
                      {record.vitalSigns.temperature && (
                        <div>
                          <p className="text-sm text-muted-foreground">Temperature</p>
                          <p className="font-medium">{record.vitalSigns.temperature}°F</p>
                        </div>
                      )}
                      {record.vitalSigns.oxygenSaturation && (
                        <div>
                          <p className="text-sm text-muted-foreground">O₂ Saturation</p>
                          <p className="font-medium">{record.vitalSigns.oxygenSaturation}%</p>
                        </div>
                      )}
                      {record.vitalSigns.weight && (
                        <div>
                          <p className="text-sm text-muted-foreground">Weight</p>
                          <p className="font-medium">{record.vitalSigns.weight} kg</p>
                        </div>
                      )}
                      {record.vitalSigns.height && (
                        <div>
                          <p className="text-sm text-muted-foreground">Height</p>
                          <p className="font-medium">{record.vitalSigns.height} cm</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Prescriptions */}
              {record.prescriptions && record.prescriptions.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="font-semibold">Prescriptions</h3>
                    <div className="space-y-3">
                      {record.prescriptions.map((prescription, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold">{prescription.medicine}</h4>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Dosage</p>
                                    <p className="font-medium">{prescription.dosage}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Frequency</p>
                                    <p className="font-medium">{prescription.frequency}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Duration</p>
                                    <p className="font-medium">{prescription.duration}</p>
                                  </div>
                                  {prescription.instructions && (
                                    <div>
                                      <p className="text-sm text-muted-foreground">Instructions</p>
                                      <p className="font-medium">{prescription.instructions}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Badge variant="outline">Active</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Notes */}
              {record.notes && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="font-semibold">Clinical Notes</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{record.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Record Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Record Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="outline">{record.status}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium">
                  {format(new Date(record.createdAt), 'MMM dd, yyyy')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated</span>
                <span className="font-medium">
                  {format(new Date(record.updatedAt), 'MMM dd, yyyy')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Prescriptions</span>
                <span className="font-medium">{record.prescriptions?.length || 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to={`/appointments/new?patient=${record.patient?._id}&doctor=${record.doctor?._id}`}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Follow-up
                </Link>
              </Button>
              {isDoctor && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to={`/health-records/new?patient=${record.patient?._id}`}>
                    <FileText className="w-4 h-4 mr-2" />
                    New Record
                  </Link>
                </Button>
              )}
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to={`/health-records?patient=${record.patient?._id}`}>
                  <FileText className="w-4 h-4 mr-2" />
                  All Records
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Medical Disclaimer */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold text-primary mb-1">Medical Disclaimer</h4>
                  <p className="text-sm text-muted-foreground">
                    This health record is for informational purposes only. Always consult with a healthcare professional for medical advice.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default HealthRecordDetails