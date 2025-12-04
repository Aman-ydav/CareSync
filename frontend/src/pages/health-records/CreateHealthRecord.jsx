import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { useHealthRecords } from '@/hooks/useHealthRecords'
import api from '@/api/axiosInterceptor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { CalendarIcon, ChevronLeft, Loader2, Plus, Trash2, User, Stethoscope } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

const healthRecordSchema = z.object({
  patient: z.string().min(1, "Patient is required"),
  hospital: z.string().optional(),
  diagnosis: z.string().min(3, "Diagnosis is required"),
  prescriptions: z.array(z.object({
    medicine: z.string().min(1, "Medicine name is required"),
    dosage: z.string().min(1, "Dosage is required"),
    frequency: z.string().min(1, "Frequency is required"),
    duration: z.string().min(1, "Duration is required"),
    instructions: z.string().optional()
  })).optional(),
  notes: z.string().optional(),
  visitDate: z.date({
    required_error: "Visit date is required",
  }),
  vitalSigns: z.object({
    bloodPressure: z.string().optional(),
    heartRate: z.number().min(0).optional(),
    temperature: z.number().min(0).optional(),
    oxygenSaturation: z.number().min(0).max(100).optional(),
    weight: z.number().min(0).optional(),
    height: z.number().min(0).optional()
  }).optional(),
  followUpDate: z.date().optional()
})

const CreateHealthRecord = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const { createHealthRecord, loading } = useHealthRecords()
  const [patients, setPatients] = useState([])
  const [hospitals, setHospitals] = useState([])
  const [loadingPatients, setLoadingPatients] = useState(false)

  const form = useForm({
    resolver: zodResolver(healthRecordSchema),
    defaultValues: {
      patient: searchParams.get('patient') || '',
      hospital: '',
      diagnosis: '',
      prescriptions: [],
      notes: '',
      visitDate: new Date(),
      vitalSigns: {},
      followUpDate: undefined
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "prescriptions"
  })

  // Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoadingPatients(true)
        const response = await api.get('/users', {
          params: { role: 'PATIENT', limit: 100 }
        })
        setPatients(response.data.data?.users || [])
      } catch (error) {
        toast.error('Failed to load patients')
      } finally {
        setLoadingPatients(false)
      }
    }

    fetchPatients()
  }, [])

  // Fetch hospitals
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await api.get('/hospitals', {
          params: { limit: 100 }
        })
        setHospitals(response.data.data?.hospitals || [])
      } catch (error) {
        console.error('Failed to load hospitals:', error)
      }
    }

    fetchHospitals()
  }, [])

  const onSubmit = async (values) => {
    try {
      const recordData = {
        ...values,
        doctor: user._id,
        visitDate: format(values.visitDate, 'yyyy-MM-dd'),
        followUpDate: values.followUpDate ? format(values.followUpDate, 'yyyy-MM-dd') : undefined
      }

      await createHealthRecord(recordData)
      toast.success('Health record created successfully!')
      navigate('/health-records')
    } catch (error) {
      toast.error(error.message || 'Failed to create health record')
    }
  }

  const addPrescription = () => {
    append({
      medicine: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate('/health-records')}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Health Record</h1>
          <p className="text-muted-foreground">
            Document patient consultation and medical information
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Patient and Hospital Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
              <CardDescription>Select the patient and hospital for this record</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="patient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a patient" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loadingPatients ? (
                          <div className="flex items-center justify-center p-4">
                            <Loader2 className="w-4 h-4 animate-spin" />
                          </div>
                        ) : patients.length > 0 ? (
                          patients.map((patient) => (
                            <SelectItem key={patient._id} value={patient._id}>
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                  <User className="w-3 h-3 text-primary" />
                                </div>
                                <span>{patient.fullName}</span>
                                {patient.bloodGroup && (
                                  <span className="text-xs text-muted-foreground">
                                    ({patient.bloodGroup})
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-4 text-center text-muted-foreground">
                            No patients available
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hospital"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hospital/Clinic (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a hospital" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Not specified</SelectItem>
                        {hospitals.map((hospital) => (
                          <SelectItem key={hospital._id} value={hospital._id}>
                            <div className="flex flex-col">
                              <span>{hospital.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {hospital.city}, {hospital.state}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="visitDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Visit Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="followUpDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Follow-up Date (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Diagnosis */}
          <Card>
            <CardHeader>
              <CardTitle>Diagnosis</CardTitle>
              <CardDescription>Primary diagnosis and clinical findings</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="diagnosis"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the primary diagnosis..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Be specific and include ICD codes if applicable
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Vital Signs */}
          <Card>
            <CardHeader>
              <CardTitle>Vital Signs (Optional)</CardTitle>
              <CardDescription>Patient's vital signs during the visit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="vitalSigns.bloodPressure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Pressure</FormLabel>
                      <FormControl>
                        <Input placeholder="120/80" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vitalSigns.heartRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Heart Rate (bpm)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="72" 
                          {...field}
                          onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : '')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vitalSigns.temperature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temperature (°F)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="98.6" 
                          {...field}
                          onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : '')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vitalSigns.oxygenSaturation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>O₂ Saturation (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="98" 
                          {...field}
                          onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : '')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vitalSigns.weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="70" 
                          {...field}
                          onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : '')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vitalSigns.height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="175" 
                          {...field}
                          onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : '')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Prescriptions */}
          <Card>
            <CardHeader>
              <CardTitle>Prescriptions</CardTitle>
              <CardDescription>Medications prescribed to the patient</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {fields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 p-4 border rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Medication #{index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`prescriptions.${index}.medicine`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medicine Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Amoxicillin" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`prescriptions.${index}.dosage`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dosage</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 500mg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`prescriptions.${index}.frequency`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frequency</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Twice daily" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`prescriptions.${index}.duration`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 7 days" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`prescriptions.${index}.instructions`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Instructions (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., Take after meals"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </motion.div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addPrescription}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Medication
              </Button>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Clinical Notes</CardTitle>
              <CardDescription>Additional observations and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Enter clinical notes, observations, and recommendations..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include treatment plan, lifestyle recommendations, and follow-up instructions
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/health-records')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="medical-gradient text-primary-foreground">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Health Record'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default CreateHealthRecord