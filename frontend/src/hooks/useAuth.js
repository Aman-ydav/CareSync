import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  const { user, loading, error, isAuthenticated, accessToken } = useSelector(
    (state) => state.auth
  );

  // ---- AUTH ACTIONS ----

  const login = useCallback((credentials) => {
    return dispatch(loginUser(credentials)).unwrap();
  }, [dispatch]);

  const register = useCallback((data) => {
    return dispatch(registerUser(data)).unwrap();
  }, [dispatch]);

  const logout = useCallback(() => {
    return dispatch(logoutUser()).unwrap();
  }, [dispatch]);

  const forgotPasswordFn = useCallback((email) => {
    return dispatch(forgotPassword(email)).unwrap();
  }, [dispatch]);

  const resetPasswordFn = useCallback((token, password) => {
    return dispatch(resetPassword({ token, password })).unwrap();
  }, [dispatch]);

  const updateUserFn = useCallback((data) => {
    return dispatch(updateUser(data)).unwrap();
  }, [dispatch]);

  const clearErrorFn = useCallback(() => {
    return dispatch(clearError());
  }, [dispatch]);

  // ---- ROLES ----
  const role = user?.role ?? null;

  const hasRole = useCallback(
    (requiredRole) => role === requiredRole,
    [role]
  );

  const isAdmin = role === "ADMIN";
  const isDoctor = role === "DOCTOR";
  const isPatient = role === "PATIENT";

  // ---- CONVENIENCE ----
  const fullName = user?.fullName ?? "";
  const email = user?.email ?? "";
  const avatar = user?.avatar ?? "";
  const userId = user?._id ?? null;
  const isGuest = !isAuthenticated;
  const ready = !loading;

  return {
    // state
    user,
    role,
    userId,
    email,
    fullName,
    avatar,
    loading,
    ready,
    error,
    accessToken,
    isAuthenticated,
    isGuest,

    // actions
    login,
    register,
    logout,
    forgotPassword: forgotPasswordFn,
    resetPassword: resetPasswordFn,
    updateUser: updateUserFn,
    clearError: clearErrorFn,

    // role helpers
    hasRole,
    isAdmin,
    isDoctor,
    isPatient,
  };
};
