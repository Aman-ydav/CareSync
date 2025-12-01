import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  updateUser,
  clearError,
} from "@/features/auth/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading, error, isAuthenticated, accessToken } = useSelector((state) => state.auth);

  const login = useCallback((credentials) => {
    return dispatch(loginUser(credentials)).unwrap();
  }, [dispatch]);

  const register = useCallback((userData) => {
    return dispatch(registerUser(userData)).unwrap();
  }, [dispatch]);

  const logout = useCallback(() => {
    return dispatch(logoutUser()).unwrap();
  }, [dispatch]);

  const forgot = useCallback((email) => {
    return dispatch(forgotPassword(email)).unwrap();
  }, [dispatch]);

  const reset = useCallback((token, password) => {
    return dispatch(resetPassword({ token, password })).unwrap();
  }, [dispatch]);

  const update = useCallback((userData) => {
    dispatch(updateUser(userData));
  }, [dispatch]);

  const clear = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  const isDoctor = useCallback(() => {
    return user?.role === "DOCTOR";
  }, [user]);

  const isPatient = useCallback(() => {
    return user?.role === "PATIENT";
  }, [user]);

  const isAdmin = useCallback(() => {
    return user?.role === "ADMIN";
  }, [user]);

  return {
    // State
    user,
    loading,
    error,
    isAuthenticated,
    accessToken,
    
    // Actions
    login,
    register,
    logout,
    forgotPassword: forgot,
    resetPassword: reset,
    updateUser: update,
    clearError: clear,
    
    // Role checks
    hasRole,
    isDoctor: isDoctor(),
    isPatient: isPatient(),
    isAdmin: isAdmin(),
    
    // Convenience
    userId: user?._id,
    userRole: user?.role,
  };
};