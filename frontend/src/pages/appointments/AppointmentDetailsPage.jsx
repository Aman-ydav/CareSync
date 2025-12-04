import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/api/axiosInterceptor";
import DashboardLayout from "@/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Stethoscope, UserCircle } from "lucide-react";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { cancelAppointment, updateAppointment } from "@/features/appointments/appointmentSlice";

const AppointmentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  const canConfirm =
    user &&
    (user.role === "DOCTOR" || user.role === "ADMIN") &&
    ["Pending", "Scheduled"].includes(appointment?.status);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/appointments/${id}`)
      .then((res) => setAppointment(res.data.data))
      .catch(() => toast.error("Failed to load appointment"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!appointment) return <div>Appointment not found</div>;

  const handleCancel = async () => {
    if (!window.confirm("Cancel appointment?")) return;

    const result = await dispatch(
      cancelAppointment({
        id: appointment._id,
        cancellationReason: "Cancelled by user",
      })
    );

    if (cancelAppointment.fulfilled.match(result)) {
      toast.success("Appointment cancelled");
      navigate("/appointments");
    } else {
      toast.error(result.payload || "Failed to cancel appointment");
    }
  };

  const handleConfirm = async () => {
    if (!window.confirm("Confirm appointment?")) return;

    const result = await dispatch(
      updateAppointment({
        id: appointment._id,
        data: { status: "Confirmed" },
      })
    );

    if (updateAppointment.fulfilled.match(result)) {
      toast.success("Appointment confirmed");
      setAppointment(result.payload); // Update local data
    } else {
      toast.error(result.payload || "Failed to confirm appointment");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* Date */}
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              <span>
                {new Date(appointment.date).toLocaleDateString()} •{" "}
                {appointment.time}
              </span>
            </div>

            {/* Doctor */}
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              <span>Dr. {appointment.doctor.fullName}</span>
            </div>

            {/* Patient */}
            <div className="flex items-center gap-2">
              <UserCircle className="w-4 h-4" />
              <span>{appointment.patient.fullName}</span>
            </div>

            {/* Reason */}
            <p className="text-xs text-muted-foreground">
              Reason: {appointment.reason}
            </p>

            {/* Status */}
            <p className="text-xs">
              Status: <b>{appointment.status}</b>
            </p>

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => navigate("/appointments")}>
                Back
              </Button>

              {user.role === "DOCTOR" && (
                <Button
                  onClick={() =>
                    navigate(
                      `/health-records/new?appointment=${appointment._id}`
                    )
                  }
                >
                  Create Health Record
                </Button>
              )}

              {canConfirm && (
                <Button variant="default" onClick={handleConfirm}>
                  Confirm
                </Button>
              )}

              {["Pending", "Scheduled", "Confirmed"].includes(
                appointment.status
              ) && (
                <Button variant="destructive" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AppointmentDetailsPage;
