// src/hooks/useHospitals.js
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  fetchHospitals,
  fetchHospitalById,
  createHospital,
  clearHospitalError,
} from "@/features/hospitals/hospitalSlice";

export const useHospitals = () => {
  const dispatch = useDispatch();
  const { hospitals, hospital, pagination, loading, error } = useSelector(
    (state) => state.hospitals
  );

  const loadHospitals = useCallback(
    (p = {}) => {
      return dispatch(fetchHospitals(p)).unwrap();
    },
    [dispatch]
  );

  const loadHospitalById = useCallback(
    (id) => {
      if (!id) return Promise.resolve();
      return dispatch(fetchHospitalById(id)).unwrap();
    },
    [dispatch]
  );

  const addHospital = useCallback(
    (payload) => {
      return dispatch(createHospital(payload)).unwrap();
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(clearHospitalError());
  }, [dispatch]);

  return {
    hospitals,
    hospital,
    pagination,
    loading,
    error,
    loadHospitals,
    loadHospitalById,
    addHospital,
    clearError,
  };
};
