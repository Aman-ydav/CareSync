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
  // Check if current route is auth modal
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

   useEffect(() => {
    // Check if user is authenticated but not verified
    if (isAuthenticated && user && !user.isVerified) {
      dispatch(showVerificationModal(user.email));
    }
  }, [isAuthenticated, user, dispatch]);

  return (
    <>

      <VerificationModal />
      {/* Always render main routes */}
      <Routes>
        {/* Home route */}
        <Route path="/" element={
          <Layout showNavbar={true}>
            <Home />
          </Layout>
        } />
        
        {/* Protected dashboard route */}
        <Route path="/dashboard" element={
          <Layout>
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          </Layout>
        } />
        
        {/* Add other protected or public routes here */}
      </Routes>

      {/* Show auth modal on top when on auth routes */}
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