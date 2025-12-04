import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import {
  fetchHealthRecords,
  fetchHealthRecordById,
  createHealthRecord,
  updateHealthRecord,
  deleteHealthRecord,
  setFilters,
  clearFilters,
} from "@/features/healthRecords/healthRecordSlice";

export const useHealthRecords = () => {
  const dispatch = useDispatch();
  const {
    records,
    currentRecord,
    pagination,
    loading,
    error,
    filters,
  } = useSelector((state) => state.healthRecords);

  const getHealthRecords = useCallback((params = {}) => {
    return dispatch(fetchHealthRecords({ ...filters, ...params }));
  }, [dispatch, filters]);

  const getHealthRecord = useCallback((id) => {
    return dispatch(fetchHealthRecordById(id));
  }, [dispatch]);

  const addHealthRecord = useCallback((data) => {
    return dispatch(createHealthRecord(data));
  }, [dispatch]);

  const editHealthRecord = useCallback((id, data) => {
    return dispatch(updateHealthRecord({ id, data }));
  }, [dispatch]);

  const removeHealthRecord = useCallback((id) => {
    return dispatch(deleteHealthRecord(id));
  }, [dispatch]);

  const updateFilters = useCallback((newFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  useEffect(() => {
    getHealthRecords();
  }, [filters]);

  return {
    records,
    currentRecord,
    pagination,
    loading,
    error,
    filters,
    getHealthRecords,
    getHealthRecord,
    addHealthRecord,
    editHealthRecord,
    removeHealthRecord,
    updateFilters,
    resetFilters,
  };
};