import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AppointmentsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
  }, [page, filters.status, filters.startDate, filters.endDate]);

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
      toast.error(result.payload || "Failed");
    }
  };

  const handleConfirm = async (apt) => {
    if (!confirm("Confirm appointment?")) return;

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
      toast.error(result.payload || "Failed");
    }
  };

  return (
    <div className="space-y-4 mt-16">

      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold">Appointments</h1>
          <p className="text-xs text-muted-foreground">
            Book and manage your medical visits.
          </p>
        </div>

        <Button size="sm" asChild>
          <Link to="/dashboard/appointments/new">
            <Plus className="h-4 w-4 mr-1" />
            New
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
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

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Appointments</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <AppointmentList
            appointments={list}
            loading={loading}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
          />

          {/* Pagination */}
          {pagination?.pages > 1 && (
            <div className="flex justify-between items-center text-xs mt-2">
              <span className="text-muted-foreground">
                Page {pagination.page} / {pagination.pages}
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
                  onClick={() => setPage((p) => pagination.hasNext ? p + 1 : p)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentsPage;
