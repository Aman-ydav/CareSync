import { useEffect } from "react";
import { useAppointments } from "@/hooks/useAppointments";
import AppointmentCard from "@/components/appointments/AppointmentCard";

export default function AppointmentList() {
  const { appointments, fetchAppointments, loading } = useAppointments();

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (loading)
    return <div className="py-10 text-center">Loading...</div>;

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">My Appointments</h1>

      {appointments.map(appt => (
        <AppointmentCard
          key={appt._id}
          appointment={appt}
          showActions={true}
        />
      ))}
    </div>
  );
}
