import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppointments } from "@/features/appointments/appointmentSlice";
import { fetchHealthRecords } from "@/features/healthRecords/healthRecordSlice";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarDays, FileText, MessageSquare } from "lucide-react";
import AppointmentList from "@/components/appointments/AppointmentList";
import HealthRecordList from "@/components/health/HealthRecordList";
import VerifyHeader from "@/components/dashboard/VerifyHeader";
import CompleteProfileBanner from "@/components/dashboard/CompleteProfileBanner";


const PatientDashboard = () => {
  const dispatch = useDispatch();
  const { list: appointments, loading: aptLoading } = useSelector(state => state.appointments);
  const { list: records, loading: recLoading } = useSelector(state => state.healthRecords);

  useEffect(() => {
    dispatch(fetchAppointments({ limit: 5 }));
    dispatch(fetchHealthRecords({ limit: 5 }));
  }, [dispatch]);

  const nextAppointment =
    appointments
      ?.filter(a => ["Pending", "Scheduled", "Confirmed"].includes(a.status))
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0] || null;

  return (
    <div className="space-y-6">

      

      {/* Top */}
      <div>
        <h1 className="text-lg font-semibold">My Care</h1>
        <p className="text-xs text-muted-foreground">
          See your upcoming appointments, health records and AI assistant.
        </p>
      </div>

      <VerifyHeader/>

      <CompleteProfileBanner/>
      

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* Next Appointment */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-primary" />
              Next Appointment
            </CardTitle>
          </CardHeader>
          <CardContent>
            {aptLoading ? (
              <p className="text-xs text-muted-foreground">Loading...</p>
            ) : nextAppointment ? (
              <>
                <p className="text-sm font-medium">
                  {new Date(nextAppointment.date).toLocaleDateString()} • {nextAppointment.time}
                </p>
                <p className="text-xs text-muted-foreground">
                  With Dr. {nextAppointment.doctor?.fullName}
                </p>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">No upcoming appointments.</p>
            )}
          </CardContent>
        </Card>

        {/* Records */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Total Health Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{records?.length || 0}</p>
            <p className="text-[11px] text-muted-foreground">OPD visits, notes & prescriptions</p>
          </CardContent>
        </Card>

        {/* AI */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              CareSync AI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-1">
              Ask general health & wellness questions anytime.
            </p>
            <p className="text-[11px] text-muted-foreground">
              Available in <span className="font-medium">AI Assistant</span>.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-primary" />
              Recent Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AppointmentList appointments={appointments} loading={aptLoading} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Recent Health Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HealthRecordList records={records} loading={recLoading} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDashboard;
