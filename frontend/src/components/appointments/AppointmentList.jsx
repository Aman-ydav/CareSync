import { Badge } from "@/components/ui/badge";
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

const AppointmentList = ({ appointments, loading, onCancel, onConfirm }) => {
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

  const canConfirmStatus = (status) =>
    ["Pending", "Scheduled"].includes(status);

  const canCancelStatus = (status) =>
    ["Pending", "Scheduled", "Confirmed"].includes(status);

  const isDoctorOrAdmin =
    user && (user.role === "DOCTOR" || user.role === "ADMIN");

  return (
    <div className="space-y-3">
      {appointments.map((apt) => (
        <div
          key={apt._id}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-border rounded-lg p-4 bg-card"
        >
          {/* Left side: info */}
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

          {/* Right side: actions */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* Status badge */}
            <Badge
              className={
                statusColors[apt.status] || "bg-gray-100 text-gray-800"
              }
            >
              {apt.status}
            </Badge>

            {/* View details */}
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigate(`/dashboard/appointments/${apt._id}`)}

            >
              View
            </Button>

            {/* Doctor: create record */}
            {user?.role === "DOCTOR" && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  navigate(`/dashboard/records/new?appointment=${apt._id}`)

                }
              >
                Create Health Record
              </Button>
            )}

            {/* Confirm (Doctor/Admin only) */}
            {isDoctorOrAdmin &&
              canConfirmStatus(apt.status) &&
              onConfirm && (
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => onConfirm(apt)}
                >
                  Confirm
                </Button>
              )}

            {/* Cancel */}
            {canCancelStatus(apt.status) && onCancel && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onCancel(apt)}
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
