import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppointments } from "@/hooks/useAppointments";
import { Loader2 } from "lucide-react";
import dayjs from "dayjs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AppointmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { appointment, loading, fetchAppointmentById } = useAppointments();

  useEffect(() => {
    if (id) fetchAppointmentById(id);
  }, [id]);

  if (loading || !appointment) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Appointment Details</h1>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      {/* STATUS */}
      <Badge
        className="text-sm"
        variant={
          appointment.status === "Confirmed"
            ? "default"
            : appointment.status === "Cancelled"
            ? "destructive"
            : "secondary"
        }
      >
        {appointment.status}
      </Badge>

      {/* DATE/TIME */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Date & Time</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          <p>
            <strong>Date:</strong>{" "}
            {dayjs(appointment.date).format("DD MMM YYYY")}
          </p>
          <p>
            <strong>Time:</strong> {appointment.time}
          </p>
          {appointment.consultationType && (
            <p>
              <strong>Type:</strong> {appointment.consultationType}
            </p>
          )}
        </CardContent>
      </Card>

      {/* DOCTOR */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Doctor</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          <p><strong>Name:</strong> {appointment.doctor?.fullName}</p>
          <p><strong>Specialty:</strong> {appointment.doctor?.specialty}</p>
          <p><strong>Qualification:</strong> {appointment.doctor?.qualification}</p>
        </CardContent>
      </Card>

      {/* HOSPITAL */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Hospital</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          <p><strong>{appointment.hospital?.name}</strong></p>
          <p>
            {appointment.hospital?.address}, {appointment.hospital?.city}{" "}
            {appointment.hospital?.state}
          </p>

          {appointment.hospital?.phone && (
            <p><strong>Phone:</strong> {appointment.hospital?.phone}</p>
          )}
        </CardContent>
      </Card>

      {/* REASON */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Reason</CardTitle>
        </CardHeader>
        <CardContent>
          {appointment.reason}
        </CardContent>
      </Card>

    </div>
  );
}
