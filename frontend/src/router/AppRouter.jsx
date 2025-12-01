import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/home/Home";
import Dashboard from "@/pages/dashboard/Dashboard";
import AuthModal from "@/components/auth/AuthModal";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import VerificationModal from "@/components/auth/VerificationModal";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

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

      {/* MAIN ROUTES — NO KEY */}
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
        </Routes>
      )}

      {/* AUTH ROUTES — UNIQUE KEY */}
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
