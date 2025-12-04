import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/api/axiosInterceptor";
import DashboardLayout from "@/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Stethoscope, UserCircle } from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const AppointmentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get(`/appointments/${id}`)
      .then(res => setAppointment(res.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!appointment) return <div>Appointment not found</div>;

  const handleCancel = async () => {
    if (!window.confirm("Cancel appointment?")) return;
    await api.post(`/appointments/${id}/cancel`);
    toast.success("Appointment cancelled");
    navigate("/appointments");
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-4">
        
        <Card>
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              <span>{new Date(appointment.date).toLocaleDateString()} • {appointment.time}</span>
            </div>

            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              <span>Dr. {appointment.doctor.fullName}</span>
            </div>

            <div className="flex items-center gap-2">
              <UserCircle className="w-4 h-4" />
              <span>{appointment.patient.fullName}</span>
            </div>

            <p className="text-xs text-muted-foreground">
              Reason: {appointment.reason}
            </p>

            <p className="text-xs">
              Status: <b>{appointment.status}</b>
            </p>

            <div className="flex justify-end gap-2 mt-6">

              <Button variant="outline" onClick={() => navigate("/appointments")}>
                Back
              </Button>

              {user.role === "DOCTOR" && (
                <Button
                  onClick={() =>
                    navigate(`/health-records/new?appointment=${appointment._id}`)
                  }
                >
                  Create Health Record
                </Button>
              )}

              {["Pending", "Scheduled", "Confirmed"].includes(appointment.status) && (
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
