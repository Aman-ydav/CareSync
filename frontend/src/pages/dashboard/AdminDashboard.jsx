import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminStats } from "@/features/admin/adminSlice";
import { fetchAppointments } from "@/features/appointments/appointmentSlice";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, Users, UserCheck, CalendarDays, FileText } from "lucide-react";
import VerifyHeader from "@/components/dashboard/VerifyHeader";

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
  const { stats, loading: statsLoading } = useSelector(s => s.admin);
  const { list: appointments, loading: aptsLoading } = useSelector(s => s.appointments);

  useEffect(() => {
    dispatch(fetchAdminStats());
    dispatch(fetchAppointments({ page: 1, limit: 5 }));
  }, [dispatch]);

  return (
    <div className="space-y-6">
    
        <VerifyHeader/>

      <div>
        <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        <p className="text-xs text-muted-foreground">
          Monitor users, appointments and health records.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard icon={Users} label="Total Users" value={stats?.totalUsers} accent="bg-primary/10 text-primary" />
        <StatCard icon={UserCheck} label="Doctors" value={stats?.totalDoctors} accent="bg-emerald-100 text-emerald-700" />
        <StatCard icon={UserCheck} label="Patients" value={stats?.totalPatients} accent="bg-blue-100 text-blue-700" />
        <StatCard icon={CalendarDays} label="Today" value={stats?.todayAppointments} accent="bg-amber-100 text-amber-700" />
        <StatCard icon={FileText} label="Active Records" value={stats?.activeRecords} accent="bg-violet-100 text-violet-700" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Activity className="w-4 h-4 text-primary" />
            Recent Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {aptsLoading || statsLoading ? (
            <p className="text-muted-foreground text-xs">Loading...</p>
          ) : (
            appointments.slice(0, 5).map(a => (
              <div key={a._id} className="border border-border/70 rounded-md px-3 py-2 text-xs flex justify-between">
                <div>
                  <p className="text-[13px] font-medium">
                    {new Date(a.date).toLocaleDateString()} • {a.time}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {a.patient?.fullName} with Dr.{a.doctor?.fullName}
                  </p>
                </div>
                <span className="text-[11px] px-2 py-1 rounded-full bg-muted">{a.status}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
