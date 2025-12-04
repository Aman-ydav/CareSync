import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import {
  fetchDashboardStats,
  fetchAllUsers,
  updateUser,
  deleteUser,
  fetchAllAppointments,
  fetchAllHealthRecords,
  fetchAnalytics,
  updateSystemSettings,
  setFilters,
  clearFilters,
} from "@/features/admin/adminSlice";

export const useAdmin = () => {
  const dispatch = useDispatch();
  const {
    stats,
    users,
    allAppointments,
    allHealthRecords,
    analytics,
    pagination,
    loading,
    error,
    filters,
  } = useSelector((state) => state.admin);

  const getDashboardStats = useCallback(() => {
    return dispatch(fetchDashboardStats());
  }, [dispatch]);

  const getAllUsers = useCallback((params = {}) => {
    return dispatch(fetchAllUsers({ ...filters, ...params }));
  }, [dispatch, filters]);

  const editUser = useCallback((id, data) => {
    return dispatch(updateUser({ id, data }));
  }, [dispatch]);

  const removeUser = useCallback((id) => {
    return dispatch(deleteUser(id));
  }, [dispatch]);

  const getAllAppointments = useCallback((params = {}) => {
    return dispatch(fetchAllAppointments(params));
  }, [dispatch]);

  const getAllHealthRecords = useCallback((params = {}) => {
    return dispatch(fetchAllHealthRecords(params));
  }, [dispatch]);

  const getAnalytics = useCallback((period = "monthly") => {
    return dispatch(fetchAnalytics(period));
  }, [dispatch]);

  const updateSettings = useCallback((settings) => {
    return dispatch(updateSystemSettings(settings));
  }, [dispatch]);

  const updateAdminFilters = useCallback((newFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  const resetAdminFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  useEffect(() => {
    getDashboardStats();
  }, []);

  useEffect(() => {
    getAllUsers();
  }, [filters]);

  return {
    stats,
    users,
    allAppointments,
    allHealthRecords,
    analytics,
    pagination,
    loading,
    error,
    filters,
    getDashboardStats,
    getAllUsers,
    editUser,
    removeUser,
    getAllAppointments,
    getAllHealthRecords,
    getAnalytics,
    updateSettings,
    updateFilters: updateAdminFilters,
    resetFilters: resetAdminFilters,
  };
};