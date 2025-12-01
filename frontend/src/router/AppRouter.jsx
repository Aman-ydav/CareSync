import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/home/Home";
import Dashboard from "@/pages/dashboard/Dashboard";
import AuthModal from "@/components/auth/AuthModal";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function AppRouter() {
  return (
    <>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Home route with layout */}
          <Route path="/" element={
            <Layout>
              <Home />
            </Layout>
          } />
          
          {/* Auth routes as modals over home */}
          <Route path="/login" element={
            <Layout>
              <Home />
              <AuthModal type="login" />
            </Layout>
          } />
          
          <Route path="/register" element={
            <Layout>
              <Home />
              <AuthModal type="register" />
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
          
          {/* 404 route */}
        
        </Routes>
      </AnimatePresence>
    </>
  );
}