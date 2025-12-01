import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/home/Home";
import Dashboard from "@/pages/dashboard/Dashboard";
import AuthModal from "@/components/auth/AuthModal";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { showVerificationModal } from '@/features/auth/authSlice';
import VerificationModal from '@/components/auth/VerificationModal';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function AppRouter() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
    if (isAuthenticated && user && !user.isVerified) {
      dispatch(showVerificationModal(user.email));
    }
  }, [isAuthenticated, user, dispatch]);

  return (
    <>
      <VerificationModal />

      {/* Hide main <Routes> while on /login or /register */}
      {!isAuthRoute && (
        <Routes>
          <Route path="/" element={
            <Layout showNavbar={true}>
              <Home />
            </Layout>
          } />

          <Route path="/dashboard" element={
            <Layout>
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </Layout>
          } />
        </Routes>
      )}

      {/* Auth modal routes */}
      <Routes>
        <Route path="/login" element={
          <>
            <Layout showNavbar={true}>
              <Home />
            </Layout>
            <AuthModal type="login" />
          </>
        } />

        <Route path="/register" element={
          <>
            <Layout showNavbar={true}>
              <Home />
            </Layout>
            <AuthModal type="register" />
          </>
        } />
      </Routes>
    </>
  );
}
