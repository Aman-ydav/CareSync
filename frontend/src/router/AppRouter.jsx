import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/home/Home";
import AuthModal from "@/components/auth/AuthModal";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import AdminDashboard from "@/pages/dashboard/AdminDashboard";
import DoctorDashboard from "@/pages/dashboard/DoctorDashboard";
import PatientDashboard from "@/pages/dashboard/PatientDashboard";

import AppointmentsPage from "@/pages/appointments/AppointmentsPage";
import HealthRecordsPage from "@/pages/records/HealthRecordsPage";
import AiAssistantPage from "@/pages/ai/AiAssistantPage";
import NewAppointmentPage from "@/pages/appointments/NewAppointmentPage";

import { useSelector } from "react-redux";
import HealthRecordCreatePage from "@/pages/records/HealthRecordCreatePage";
import AppointmentDetailsPage from "@/pages/appointments/AppointmentDetailsPage";
import HealthRecordDetailsPage from "@/pages/records/HealthRecordDetailsPage";

export default function AppRouter() {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/register";

  // default redirect based on role
  const defaultDashboard = () => {
    if (!user) return "/login";
    if (user.role === "ADMIN") return "/dashboard/admin";
    if (user.role === "DOCTOR") return "/dashboard/doctor";
    return "/dashboard/patient";
  };

  return (
    <>
      {/* PUBLIC / MAIN ROUTES */}
      {!isAuthRoute && (
        <Routes location={location}>
          {/* Home */}
          <Route
            path="/"
            element={
              <Layout showNavbar={true}>
                <Home />
              </Layout>
            }
          />

          {/* Middle redirect when someone opens /dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Navigate to={defaultDashboard()} replace />
              </ProtectedRoute>
            }
          />

          {/* ROLE-WISE DASHBOARDS */}
          <Route
            path="/dashboard/admin"
            element={
              <Layout>
                <ProtectedRoute roles={["ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              </Layout>
            }
          />

          <Route
            path="/dashboard/doctor"
            element={
              <Layout>
                <ProtectedRoute roles={["DOCTOR"]}>
                  <DoctorDashboard />
                </ProtectedRoute>
              </Layout>
            }
          />

          <Route
            path="/dashboard/patient"
            element={
              <Layout>
                <ProtectedRoute roles={["PATIENT"]}>
                  <PatientDashboard />
                </ProtectedRoute>
              </Layout>
            }
          />

          {/* SHARED PAGES */}
          <Route
            path="/appointments"
            element={
              <Layout>
                <ProtectedRoute roles={["ADMIN", "DOCTOR", "PATIENT"]}>
                  <AppointmentsPage />
                </ProtectedRoute>
              </Layout>
            }
          />

          <Route
            path="/appointments/new"
            element={
              <Layout>
                <ProtectedRoute roles={["PATIENT"]}>
                  <NewAppointmentPage />
                </ProtectedRoute>
              </Layout>
            }
          />

          <Route
            path="/appointments/:id"
            element={
              <Layout>
                <ProtectedRoute roles={["ADMIN", "DOCTOR", "PATIENT"]}>
                  <AppointmentDetailsPage />
                </ProtectedRoute>
              </Layout>
            }
          />

          <Route
            path="/records"
            element={
              <Layout>
                <ProtectedRoute roles={["ADMIN", "DOCTOR", "PATIENT"]}>
                  <HealthRecordsPage />
                </ProtectedRoute>
              </Layout>
            }
          />

          <Route
            path="/records/new"
            element={
              <Layout>
                <ProtectedRoute roles={["ADMIN", "DOCTOR"]}>
                  <HealthRecordCreatePage />
                </ProtectedRoute>
              </Layout>
            }
          />

          <Route
            path="/records/:id"
            element={
              <Layout>
                <ProtectedRoute roles={["ADMIN", "DOCTOR", "PATIENT"]}>
                  <HealthRecordDetailsPage />
                </ProtectedRoute>
              </Layout>
            }
          />

          <Route
            path="/ai-assistant"
            element={
              <Layout>
                <ProtectedRoute roles={["ADMIN", "DOCTOR", "PATIENT"]}>
                  <AiAssistantPage />
                </ProtectedRoute>
              </Layout>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}

      {/* AUTH MODAL ROUTES */}
      {isAuthRoute && (
        <Routes>
          <Route
            path="/login"
            element={
              <>
                <Layout showNavbar={true}>
                  <Home />
                </Layout>
                <AuthModal type="login" />
              </>
            }
          />

          <Route
            path="/register"
            element={
              <>
                <Layout showNavbar={true}>
                  <Home />
                </Layout>
                <AuthModal type="register" />
              </>
            }
          />
        </Routes>
      )}
    </>
  );
}
