import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  FileText,
  Stethoscope,
  TrendingUp,
  Activity,
  DollarSign,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/dashboard/StatsCard";
import { useAdmin } from "@/hooks/useAdmin";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { stats, getDashboardStats, loading } = useAdmin();

  useEffect(() => {
    getDashboardStats();
  }, []);

  const dashboardStats = [
    {
      title: "Total Users",
      value: stats.totalUsers || "0",
      icon: Users,
      color: "blue",
      trend: { value: 12, label: "from last month" },
    },
    {
      title: "Doctors",
      value: stats.totalDoctors || "0",
      icon: Stethoscope,
      color: "green",
      trend: { value: 3, label: "active now" },
    },
    {
      title: "Patients",
      value: stats.totalPatients || "0",
      icon: UserCheck,
      color: "purple",
      trend: { value: 8, label: "new this week" },
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments || "0",
      icon: Calendar,
      color: "orange",
      trend: { value: 5, label: "upcoming" },
    },
    {
      title: "Active Records",
      value: stats.activeRecords || "0",
      icon: FileText,
      color: "blue",
      trend: { value: 15, label: "updated today" },
    },
    {
      title: "Revenue",
      value: `$${stats.revenue || "0"}`,
      icon: DollarSign,
      color: "green",
      trend: { value: 18, label: "from last month" },
    },
  ];

  const quickActions = [
    {
      title: "Manage Users",
      description: "Add, edit, or remove users",
      icon: Users,
      path: "/admin/users",
      color: "bg-blue-500",
    },
    {
      title: "View Appointments",
      description: "See all scheduled appointments",
      icon: Calendar,
      path: "/admin/appointments",
      color: "bg-green-500",
    },
    {
      title: "Health Records",
      description: "Access all medical records",
      icon: FileText,
      path: "/admin/health-records",
      color: "bg-purple-500",
    },
    {
      title: "Analytics",
      description: "View system performance",
      icon: TrendingUp,
      path: "/admin/analytics",
      color: "bg-orange-500",
    },
    {
      title: "Doctor Management",
      description: "Manage doctor schedules",
      icon: Stethoscope,
      path: "/admin/doctors",
      color: "bg-red-500",
    },
    {
      title: "System Settings",
      description: "Configure application settings",
      icon: Activity,
      path: "/admin/settings",
      color: "bg-indigo-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            System overview and management
          </p>
        </div>
        <Button onClick={() => navigate("/admin/analytics")}>
          <TrendingUp className="w-4 h-4 mr-2" />
          View Analytics
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {dashboardStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              className="h-auto p-4 flex items-start gap-4 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
              onClick={() => navigate(action.path)}
            >
              <div className={`p-3 rounded-lg ${action.color} text-white`}>
                <action.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {action.description}
                </p>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Recent Activity & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[
              {
                user: "Dr. Sarah Johnson",
                action: "added new health record",
                time: "10 minutes ago",
                color: "bg-green-100 text-green-800",
              },
              {
                user: "John Doe",
                action: "booked appointment",
                time: "30 minutes ago",
                color: "bg-blue-100 text-blue-800",
              },
              {
                user: "Admin",
                action: "updated system settings",
                time: "1 hour ago",
                color: "bg-purple-100 text-purple-800",
              },
              {
                user: "Dr. Michael Chen",
                action: "cancelled appointment",
                time: "2 hours ago",
                color: "bg-red-100 text-red-800",
              },
              {
                user: "Emma Wilson",
                action: "registered as patient",
                time: "3 hours ago",
                color: "bg-yellow-100 text-yellow-800",
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {activity.user}
                    </p>
                    <p className="text-sm text-gray-500">{activity.action}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            System Status
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">API Server</h3>
                <p className="text-sm text-gray-500">Backend Services</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-green-600 font-medium">Operational</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Database</h3>
                <p className="text-sm text-gray-500">MongoDB Cluster</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-green-600 font-medium">Healthy</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">AI Service</h3>
                <p className="text-sm text-gray-500">Gemini AI Integration</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-green-600 font-medium">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Storage</h3>
                <p className="text-sm text-gray-500">Cloudinary & Local</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-yellow-600 font-medium">85% Used</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Uptime</h3>
                <p className="text-sm text-gray-500">Last 30 Days</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-green-600 font-medium">99.9%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;