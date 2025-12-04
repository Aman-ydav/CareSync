import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useHealthRecords } from '@/hooks/useHealthRecords'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Plus, Search, Filter, Calendar } from 'lucide-react'
import HealthRecordCard from '@/components/health-records/HealthRecordCard'

const HealthRecords = () => {
  const { user, isDoctor } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('Active')
  
  const { 
    healthRecords, 
    loading, 
    fetchHealthRecords,
    pagination 
  } = useHealthRecords()

  useEffect(() => {
    const params = {}
    if (searchQuery) params.search = searchQuery
    if (dateFilter !== 'all') params.dateRange = dateFilter
    if (statusFilter !== 'all') params.status = statusFilter
    setSearchParams(params)
    
    fetchHealthRecords(params)
  }, [searchQuery, dateFilter, statusFilter])

  const filteredRecords = healthRecords?.filter(record => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        record.diagnosis?.toLowerCase().includes(query) ||
        record.doctor?.fullName?.toLowerCase().includes(query) ||
        record.hospital?.name?.toLowerCase().includes(query) ||
        (isDoctor && record.patient?.fullName?.toLowerCase().includes(query))
      )
    }
    return true
  }) || []

  const stats = {
    total: filteredRecords.length,
    active: filteredRecords.filter(r => r.status === 'Active').length,
    archived: filteredRecords.filter(r => r.status === 'Archived').length
  }

  // Date filter options
  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Health Records</h1>
          <p className="text-muted-foreground">
            {isDoctor ? 'Manage patient health records' : 'View your medical history and records'}
          </p>
        </div>
        {isDoctor && (
          <Button asChild className="medical-gradient text-primary-foreground">
            <Link to="/health-records/new">
              <Plus className="w-4 h-4 mr-2" />
              New Record
            </Link>
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Records</p>
                <h3 className="text-2xl font-bold">{stats.total}</h3>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <FileText className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <h3 className="text-2xl font-bold">{stats.active}</h3>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <FileText className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Archived</p>
                <h3 className="text-2xl font-bold">{stats.archived}</h3>
              </div>
              <div className="p-3 rounded-lg bg-yellow-500/10">
                <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                  <FileText className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search records..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  {dateOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records List */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Records</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          {isDoctor && <TabsTrigger value="patients">By Patient</TabsTrigger>}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : filteredRecords.length > 0 ? (
            filteredRecords.map((record, index) => (
              <motion.div
                key={record._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <HealthRecordCard 
                  record={record} 
                  showPatient={isDoctor}
                  showActions={true}
                />
              </motion.div>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No health records found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery 
                    ? 'Try changing your search query' 
                    : isDoctor 
                    ? 'Create your first health record for a patient'
                    : 'Your health records will appear here after doctor visits'}
                </p>
                {isDoctor && (
                  <Button asChild>
                    <Link to="/health-records/new">Create Record</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="recent">
          {filteredRecords
            .slice(0, 10)
            .map((record, index) => (
              <motion.div
                key={record._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <HealthRecordCard 
                  record={record} 
                  showPatient={isDoctor}
                  showActions={true}
                />
              </motion.div>
            ))}
        </TabsContent>

        <TabsContent value="active">
          {filteredRecords
            .filter(record => record.status === 'Active')
            .map((record, index) => (
              <motion.div
                key={record._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <HealthRecordCard 
                  record={record} 
                  showPatient={isDoctor}
                  showActions={true}
                />
              </motion.div>
            ))}
        </TabsContent>

        {isDoctor && (
          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>Records by Patient</CardTitle>
                <CardDescription>View health records grouped by patient</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Group records by patient */}
                {(() => {
                  const patientGroups = filteredRecords.reduce((groups, record) => {
                    const patientId = record.patient?._id
                    if (!patientId) return groups
                    
                    if (!groups[patientId]) {
                      groups[patientId] = {
                        patient: record.patient,
                        records: []
                      }
                    }
                    groups[patientId].records.push(record)
                    return groups
                  }, {})

                  return Object.values(patientGroups).map((group, index) => (
                    <div key={group.patient._id} className="mb-6 last:mb-0">
                      <div className="flex items-center gap-3 mb-4 p-3 bg-muted rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-semibold">
                            {group.patient.fullName?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{group.patient.fullName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {group.records.length} record{group.records.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3 ml-4 pl-4 border-l">
                        {group.records.map(record => (
                          <HealthRecordCard 
                            key={record._id}
                            record={record}
                            compact={true}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                })()}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            disabled={!pagination.hasPrev}
            onClick={() => fetchHealthRecords({ page: pagination.page - 1 })}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            disabled={!pagination.hasNext}
            onClick={() => fetchHealthRecords({ page: pagination.page + 1 })}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

export default HealthRecords