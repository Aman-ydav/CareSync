import { Badge } from "@/components/ui/badge"; // if you have it; else use span with classes
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Stethoscope, UserCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const statusColors = {
  Pending: "bg-amber-100 text-amber-800",
  Scheduled: "bg-blue-100 text-blue-800",
  Confirmed: "bg-emerald-100 text-emerald-800",
  Completed: "bg-gray-100 text-gray-800",
  Cancelled: "bg-red-100 text-red-800",
};

const AppointmentList = ({ appointments, loading, onView, onCancel }) => {
  const { user } = useAuth();

  const navigate = useNavigate();

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">Loading appointments...</p>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No appointments found.</p>
    );
  }

  return (
    <div className="space-y-3">
      {appointments.map((apt) => (
        <div
          key={apt._id}
          className="flex flex-col md:flex-row md:items-center justify-between gap-3 border border-border rounded-lg p-3 bg-card"
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                {new Date(apt.date).toLocaleDateString()} • {apt.time}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
              {apt.doctor && (
                <span className="flex items-center gap-1">
                  <Stethoscope className="w-3 h-3" />
                  Dr. {apt.doctor.fullName}
                  {apt.doctor.specialty && ` • ${apt.doctor.specialty}`}
                </span>
              )}
              {apt.patient && (
                <span className="flex items-center gap-1">
                  <UserCircle className="w-3 h-3" />
                  {apt.patient.fullName}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Reason: {apt.reason}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium ${
                statusColors[apt.status] || "bg-gray-100 text-gray-800"
              }`}
            >
              {apt.status}
            </span>
            {user.role === "Doctor" && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => navigate(`/records/new?appointment=${apt._id}`)}
              >
                Create Health Record
              </Button>
            )}

            <Button onClick={() => navigate(`/appointments/${apt._id}`)}>
              View
            </Button>

            {["Pending", "Scheduled", "Confirmed"].includes(apt.status) && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onCancel?.(apt)}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentList;
