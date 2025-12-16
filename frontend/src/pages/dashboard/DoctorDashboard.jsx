import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAppointments,
  cancelAppointment,
  updateAppointment,
} from "@/features/appointments/appointmentSlice";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarDays, Stethoscope, Activity } from "lucide-react";
import AppointmentList from "@/components/appointments/AppointmentList";
import { toast } from "sonner";
import VerifyHeader from "@/components/dashboard/VerifyHeader";
import CompleteProfileBanner from "@/components/dashboard/CompleteProfileBanner";

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.appointments);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchAppointments({ limit: 10 }));
  }, [dispatch]);

  const today = list.filter(
    (a) => new Date(a.date).toDateString() === new Date().toDateString()
  );

  const handleCancel = async (apt) => {
    const result = await dispatch(
      cancelAppointment({
        id: apt._id,
        cancellationReason: "Cancelled by doctor",
      })
    );
    if (cancelAppointment.fulfilled.match(result)) {
      toast.success("Cancelled");
      dispatch(fetchAppointments({ limit: 10 }));
    } else {
      toast.error(result.payload || "Failed");
    }
  };

  const handleConfirm = async (apt) => {
    const result = await dispatch(
      updateAppointment({
        id: apt._id,
        data: { status: "Confirmed" },
      })
    );
    if (updateAppointment.fulfilled.match(result)) {
      toast.success("Confirmed");
      dispatch(fetchAppointments({ limit: 10 }));
    } else {
      toast.error(result.payload || "Failed");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Doctor Dashboard</h1>
        <p className="text-xs text-muted-foreground">
          Manage your schedule and consultations.
        </p>
      </div>
      <VerifyHeader />

      <CompleteProfileBanner />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-primary" />
              Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{today.length}</p>
            <p className="text-[11px] text-muted-foreground">Scheduled today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-primary" />
              Next 7 days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {
                list.filter((a) => {
                  const diff =
                    (new Date(a.date) - new Date()) / (1000 * 60 * 60 * 24);
                  return diff >= 0 && diff <= 7;
                }).length
              }
            </p>
            <p className="text-[11px] text-muted-foreground">Scheduled</p>
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
            Upcoming
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
  );
};

export default DoctorDashboard;
