import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import {
  fetchAppointments,
  fetchAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  fetchAvailableSlots,
  fetchUpcomingAppointments,
  updateAppointmentStatus,
  setFilters,
  clearFilters,
} from "@/features/appointments/appointmentSlice";

export const useAppointments = () => {
  const dispatch = useDispatch();
  const {
    appointments,
    upcomingAppointments,
    currentAppointment,
    availableSlots,
    pagination,
    loading,
    error,
    filters,
  } = useSelector((state) => state.appointments);

  const getAppointments = useCallback((params = {}) => {
    return dispatch(fetchAppointments({ ...filters, ...params }));
  }, [dispatch, filters]);

  const getAppointment = useCallback((id) => {
    return dispatch(fetchAppointmentById(id));
  }, [dispatch]);

  const bookAppointment = useCallback((data) => {
    return dispatch(createAppointment(data));
  }, [dispatch]);

  const editAppointment = useCallback((id, data) => {
    return dispatch(updateAppointment({ id, data }));
  }, [dispatch]);

  const cancelAppt = useCallback((id, reason) => {
    return dispatch(cancelAppointment({ id, reason }));
  }, [dispatch]);

  const getSlots = useCallback((doctorId, date) => {
    return dispatch(fetchAvailableSlots({ doctorId, date }));
  }, [dispatch]);

  const getUpcoming = useCallback((limit = 5) => {
    return dispatch(fetchUpcomingAppointments(limit));
  }, [dispatch]);

  const updateStatus = useCallback((id, status, notes = "") => {
    return dispatch(updateAppointmentStatus({ id, status, notes }));
  }, [dispatch]);

  const updateFilters = useCallback((newFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  useEffect(() => {
    getAppointments();
  }, [filters]);

  useEffect(() => {
    getUpcoming(5);
  }, []);

  return {
    appointments,
    upcomingAppointments,
    currentAppointment,
    availableSlots,
    pagination,
    loading,
    error,
    filters,
    getAppointments,
    getAppointment,
    bookAppointment,
    editAppointment,
    cancelAppointment: cancelAppt,
    getAvailableSlots: getSlots,
    getUpcomingAppointments: getUpcoming,
    updateAppointmentStatus: updateStatus,
    updateFilters,
    resetFilters,
  };
};