import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "@/layout/DashboardLayout";
import {
  fetchAppointments,
  cancelAppointment,
  updateAppointment,
} from "@/features/appointments/appointmentSlice";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarDays, Stethoscope, Activity } from "lucide-react";
import AppointmentList from "@/components/appointments/AppointmentList";
import { toast } from "sonner";

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.appointments);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAppointments({ limit: 10 }));
  }, [dispatch]);

  const todayAppointments = list.filter((apt) => {
    const d = new Date(apt.date).toDateString();
    return d === new Date().toDateString();
  });

  const handleCancel = async (apt) => {
    if (!confirm("Cancel this appointment?")) return;

    const result = await dispatch(
      cancelAppointment({
        id: apt._id,
        cancellationReason: "Cancelled by doctor",
      })
    );

    if (cancelAppointment.fulfilled.match(result)) {
      toast.success("Appointment cancelled");
      dispatch(fetchAppointments({ limit: 10 }));
    } else {
      toast.error(result.payload || "Failed to cancel appointment");
    }
  };

  const handleConfirm = async (apt) => {
    if (!confirm("Confirm this appointment?")) return;

    const result = await dispatch(
      updateAppointment({
        id: apt._id,
        data: { status: "Confirmed" },
      })
    );

    if (updateAppointment.fulfilled.match(result)) {
      toast.success("Appointment confirmed");
      dispatch(fetchAppointments({ limit: 10 }));
    } else {
      toast.error(result.payload || "Failed to confirm appointment");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-lg font-semibold">Doctor Dashboard</h1>
          <p className="text-xs text-muted-foreground">
            Manage your schedule, upcoming consultations and patient records.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-primary" />
                Today's Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                {todayAppointments.length}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Patients scheduled for today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary" />
                Upcoming (7 days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                {list.filter((apt) => {
                  const now = new Date();
                  const d = new Date(apt.date);
                  const diff = (d - now) / (1000 * 60 * 60 * 24);
                  return diff >= 0 && diff <= 7;
                }).length}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Scheduled within next week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">{user?.fullName}</p>
              <p className="text-xs text-muted-foreground">
                {user?.specialty || "Doctor"} • {user?.qualification || ""}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-primary" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AppointmentList
              appointments={list}
              loading={loading}
              onCancel={handleCancel}
              onConfirm={handleConfirm}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
