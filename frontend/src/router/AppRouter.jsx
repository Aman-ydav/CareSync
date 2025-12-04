import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import AppLayout from "@/layout/AppLayout";
import DashboardLayout from "@/layout/DashboardLayout";

import Home from "@/pages/home/Home";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AuthModal from "@/components/auth/AuthModal";

// Dashboards
import AdminDashboard from "@/pages/dashboard/AdminDashboard";
import DoctorDashboard from "@/pages/dashboard/DoctorDashboard";
import PatientDashboard from "@/pages/dashboard/PatientDashboard";

// Shared pages
import AppointmentsPage from "@/pages/appointments/AppointmentsPage";
import AppointmentDetailsPage from "@/pages/appointments/AppointmentDetailsPage";
import NewAppointmentPage from "@/pages/appointments/NewAppointmentPage";

import HealthRecordsPage from "@/pages/records/HealthRecordsPage";
import HealthRecordDetailsPage from "@/pages/records/HealthRecordDetailsPage";
import HealthRecordCreatePage from "@/pages/records/HealthRecordCreatePage";

import AiAssistantPage from "@/pages/ai/AiAssistantPage";

export default function AppRouter() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const getDashboardPath = () => {
    if (!user) return "/";
    if (user.role === "ADMIN") return "/dashboard/admin";
    if (user.role === "DOCTOR") return "/dashboard/doctor";
    return "/dashboard/patient";
  };

  // If logged in → redirect public pages to dashboard
  const redirectIfLoggedIn = (element) => {
    return isAuthenticated ? (
      <Navigate to={getDashboardPath()} replace />
    ) : (
      element
    );
  };

  return (
    <Routes>

      {/* ========= PUBLIC ROUTES =========== */}
      <Route element={<AppLayout />}>

        {/* Home */}
        <Route
          path="/"
          element={redirectIfLoggedIn(<Home />)}
        />

        {/* Login Modal */}
        <Route
          path="/login"
          element={redirectIfLoggedIn(
            <>
              <Home />
              <AuthModal type="login" />
            </>
          )}
        />

        {/* Register Modal */}
        <Route
          path="/register"
          element={redirectIfLoggedIn(
            <>
              <Home />
              <AuthModal type="register" />
            </>
          )}
        />

      </Route>


      {/* ========= DASHBOARD ROUTES (Protected) =========== */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >

        {/* When user visits /dashboard → redirect to role-based page */}
        <Route
          index
          element={
            <Navigate to={getDashboardPath()} replace />
          }
        />

        {/* ADMIN */}
        <Route
          path="admin"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* DOCTOR */}
        <Route
          path="doctor"
          element={
            <ProtectedRoute roles={["DOCTOR"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        {/* PATIENT */}
        <Route
          path="patient"
          element={
            <ProtectedRoute roles={["PATIENT"]}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />


        {/* ===== Shared routes under dashboard ===== */}

        {/* Appointments */}
        <Route
          path="appointments"
          element={
            <ProtectedRoute roles={["ADMIN", "DOCTOR", "PATIENT"]}>
              <AppointmentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="appointments/:id"
          element={
            <ProtectedRoute roles={["ADMIN", "DOCTOR", "PATIENT"]}>
              <AppointmentDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="appointments/new"
          element={
            <ProtectedRoute roles={["PATIENT"]}>
              <NewAppointmentPage />
            </ProtectedRoute>
          }
        />

        {/* Records */}
        <Route
          path="records"
          element={
            <ProtectedRoute roles={["ADMIN", "DOCTOR", "PATIENT"]}>
              <HealthRecordsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="records/new"
          element={
            <ProtectedRoute roles={["ADMIN", "DOCTOR"]}>
              <HealthRecordCreatePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="records/:id"
          element={
            <ProtectedRoute roles={["ADMIN", "DOCTOR", "PATIENT"]}>
              <HealthRecordDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* AI Assistant */}
        <Route
          path="ai"
          element={
            <ProtectedRoute roles={["ADMIN", "DOCTOR", "PATIENT"]}>
              <AiAssistantPage />
            </ProtectedRoute>
          }
        />

      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
