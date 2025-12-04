import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/home/Home";
import Dashboard from "@/pages/dashboard/Dashboard";
import Appointments from "@/pages/appointments/Appointments";
import CreateAppointment from "@/pages/appointments/CreateAppointment";
import AppointmentDetails from "@/pages/appointments/AppointmentDetails";
import HealthRecords from "@/pages/health-records/HealthRecords";
import CreateHealthRecord from "@/pages/health-records/CreateHealthRecord";
import HealthRecordDetails from "@/pages/health-records/HealthRecordDetails";
import Hospitals from "@/pages/hospitals/Hospitals";
import AIChat from "@/pages/ai-chat/AIChat";
import Profile from "@/pages/profile/Profile";
import Settings from "@/pages/settings/Settings";
import AuthModal from "@/components/auth/AuthModal";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateHospital from "@/pages/hospitals/CreateHospital";
import HospitalDetails from "@/pages/hospitals/HospitalDetails";

export default function AppRouter() {
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const hasCheckedVerification = useRef(false);

  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    if (!user) hasCheckedVerification.current = false;
  }, [user]);

  return (
    <>
      {/* MAIN ROUTES */}
      {!isAuthRoute && (
        <Routes location={location}>
          <Route
            path="/"
            element={
              <Layout showNavbar={true}>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <Layout>
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/appointments"
            element={
              <Layout>
                <ProtectedRoute>
                  <Appointments />
                </ProtectedRoute>
              </Layout>
            }
          />

          <Route
            path="/appointments/new"
            element={
              <Layout>
                <ProtectedRoute>
                  <CreateAppointment />
                </ProtectedRoute>
              </Layout>
            }
          />

          <Route
            path="/appointments/:id"
            element={
              <Layout>
                <ProtectedRoute>
                  <AppointmentDetails />
                </ProtectedRoute>
              </Layout>
            }
          />

          <Route
            path="/health-records"
            element={
              <Layout>
                <ProtectedRoute>
                  <HealthRecords />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/health-records/new"
            element={
              <Layout>
                <ProtectedRoute>
                  <CreateHealthRecord />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/health-records/:id"
            element={
              <Layout>
                <ProtectedRoute>
                  <HealthRecordDetails />
                </ProtectedRoute>
              </Layout>
            }
          />

          <Route
            path="/hospitals"
            element={
              <Layout>
                <ProtectedRoute>
                  <Hospitals />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/hospitals/new"
            element={
              <Layout>
                <ProtectedRoute adminOnly>
                  <CreateHospital />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/hospitals/:id"
            element={
              <Layout>
                <ProtectedRoute>
                  <HospitalDetails />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/ai-chat"
            element={
              <Layout>
                <ProtectedRoute>
                  <AIChat />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout>
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/settings"
            element={
              <Layout>
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              </Layout>
            }
          />
        </Routes>
      )}

      {/* AUTH ROUTES */}
      {isAuthRoute && (
        <Routes key={"auth-modal"}>
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
