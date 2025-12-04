import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "@/layout/DashboardLayout";
import {
  fetchAppointments,
  setAppointmentFilters,
  cancelAppointment,
  updateAppointment,
} from "@/features/appointments/appointmentSlice";
import AppointmentList from "@/components/appointments/AppointmentList";
import AppointmentFilters from "@/components/appointments/AppointmentFilters";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const AppointmentsPage = () => {
  const dispatch = useDispatch();
  const { list, loading, filters, pagination } = useSelector(
    (state) => state.appointments
  );

  const [page, setPage] = useState(1);

  const loadAppointments = (override = {}) => {
    dispatch(
      fetchAppointments({
        page,
        status: filters.status || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        ...override,
      })
    );
  };

  useEffect(() => {
    loadAppointments();
  }, [dispatch, page, filters.status, filters.startDate, filters.endDate]);

  const handleFilterChange = (partial) => {
    dispatch(setAppointmentFilters(partial));
    setPage(1);
  };

  const handleCancel = async (apt) => {
    if (!confirm("Cancel this appointment?")) return;

    const result = await dispatch(
      cancelAppointment({
        id: apt._id,
        cancellationReason: "Cancelled by user",
      })
    );

    if (cancelAppointment.fulfilled.match(result)) {
      toast.success("Appointment cancelled");
      loadAppointments({ page: 1 });
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
      loadAppointments();
    } else {
      toast.error(result.payload || "Failed to confirm appointment");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-lg font-semibold">Appointments</h1>
            <p className="text-xs text-muted-foreground">
              View and manage your appointments.
            </p>
          </div>
          <Button size="sm" className="flex items-center gap-1" asChild>
            <Link to="/appointments/new">
              <Plus className="w-4 h-4" />
              New Appointment
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <AppointmentFilters
              filters={filters}
              onChange={handleFilterChange}
              onApply={() => {
                setPage(1);
                loadAppointments({ page: 1 });
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Appointments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AppointmentList
              appointments={list}
              loading={loading}
              onCancel={handleCancel}
              onConfirm={handleConfirm}
            />

            {pagination?.pages > 1 && (
              <div className="flex justify-between items-center text-xs mt-2">
                <span className="text-muted-foreground">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <div className="space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!pagination.hasPrev}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!pagination.hasNext}
                    onClick={() =>
                      setPage((p) => (pagination.hasNext ? p + 1 : p))
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AppointmentsPage;
