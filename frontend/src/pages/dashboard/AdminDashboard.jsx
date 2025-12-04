import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminStats } from "@/features/admin/adminSlice";
import { fetchAppointments } from "@/features/appointments/appointmentSlice";
import DashboardLayout from "@/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, Users, UserCheck, CalendarDays, FileText } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <Card className="border border-border/70">
    <CardHeader className="flex flex-row items-center justify-between pb-3">
      <CardTitle className="text-xs font-medium text-muted-foreground">
        {label}
      </CardTitle>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${accent}`}>
        <Icon className="w-4 h-4" />
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-xl font-semibold">{value ?? "-"}</p>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading: statsLoading } = useSelector((state) => state.admin);
  const { list: appointments, loading: aptsLoading } = useSelector(
    (state) => state.appointments
  );

  useEffect(() => {
    dispatch(fetchAdminStats());
    // upcoming appointments
    dispatch(fetchAppointments({ page: 1, limit: 5 }));
  }, [dispatch]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          <p className="text-xs text-muted-foreground">
            Monitor users, appointments and health records across CareSync.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <StatCard
            icon={Users}
            label="Total Users"
            value={stats?.totalUsers}
            accent="bg-primary/10 text-primary"
          />
          <StatCard
            icon={UserCheck}
            label="Doctors"
            value={stats?.totalDoctors}
            accent="bg-emerald-100 text-emerald-700"
          />
          <StatCard
            icon={UserCheck}
            label="Patients"
            value={stats?.totalPatients}
            accent="bg-blue-100 text-blue-700"
          />
          <StatCard
            icon={CalendarDays}
            label="Today's Appointments"
            value={stats?.todayAppointments}
            accent="bg-amber-100 text-amber-700"
          />
          <StatCard
            icon={FileText}
            label="Active Health Records"
            value={stats?.activeRecords}
            accent="bg-violet-100 text-violet-700"
          />
        </div>

        {/* Recent Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4 text-primary" />
              Recent Appointments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            {aptsLoading || statsLoading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : appointments && appointments.length > 0 ? (
              <div className="space-y-2">
                {appointments.slice(0, 5).map((apt) => (
                  <div
                    key={apt._id}
                    className="flex items-center justify-between border border-border/70 rounded-md px-3 py-2"
                  >
                    <div className="space-y-0.5">
                      <p className="text-[13px] font-medium">
                        {new Date(apt.date).toLocaleDateString()} • {apt.time}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {apt.patient?.fullName} with Dr. {apt.doctor?.fullName}
                      </p>
                    </div>
                    <span className="text-[11px] px-2 py-1 rounded-full bg-muted">
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No recent appointments.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
