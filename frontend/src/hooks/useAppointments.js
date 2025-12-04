import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  fetchAppointments,
  fetchAppointmentById,
  fetchSlots,
  createAppointment,
  cancelAppointment,
  clearAppointmentError,
} from "@/features/appointments/appointmentSlice";

export const useAppointments = () => {
  const dispatch = useDispatch();

  const {
    list,
    appointment,
    slots,
    pagination,
    loading,
    error,
  } = useSelector((state) => state.appointments);

  // -- MAP new names to old format
  const appointments = list;

  const loadAppointments = useCallback(
    (params = {}) => {
      return dispatch(fetchAppointments(params)).unwrap();
    },
    [dispatch]
  );

  const loadAppointmentById = useCallback(
    (id) => {
      if (!id) return;
      return dispatch(fetchAppointmentById(id)).unwrap();
    },
    [dispatch]
  );

  const loadSlots = useCallback(
    (params) => {
      return dispatch(fetchSlots(params)).unwrap();
    },
    [dispatch]
  );

  const addAppointment = useCallback(
    (payload) => {
      return dispatch(createAppointment(payload)).unwrap();
    },
    [dispatch]
  );

  const cancel = useCallback(
    ({ id, reason }) => {
      return dispatch(cancelAppointment({ id, reason })).unwrap();
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(clearAppointmentError());
  }, [dispatch]);

  return {
    // DATA
    appointments,
    appointment,
    slots,
    pagination,
    loading,
    error,

    fetchAppointments: loadAppointments,
    fetchAppointmentById: loadAppointmentById,
    fetchSlots: loadSlots,
    createAppointment: addAppointment,
    cancelAppointment: cancel,
    clearError,
  };
};
