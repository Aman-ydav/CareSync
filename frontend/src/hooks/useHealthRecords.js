import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  fetchHealthRecords,
  createHealthRecord,
  updateHealthRecord,
  deleteHealthRecord,
  clearError,
} from '@/features/health-records/healthRecordSlice';

export const useHealthRecords = () => {
  const dispatch = useDispatch();
  const { healthRecords, loading, error, pagination } = useSelector((state) => state.healthRecords);

  const fetchHealthRecordsAction = useCallback((params = {}) => {
    return dispatch(fetchHealthRecords(params)).unwrap();
  }, [dispatch]);

  const createHealthRecordAction = useCallback((recordData) => {
    return dispatch(createHealthRecord(recordData)).unwrap();
  }, [dispatch]);

  const updateHealthRecordAction = useCallback((id, updateData) => {
    return dispatch(updateHealthRecord({ id, updateData })).unwrap();
  }, [dispatch]);

  const deleteHealthRecordAction = useCallback((id) => {
    return dispatch(deleteHealthRecord(id)).unwrap();
  }, [dispatch]);

  const clearErrorAction = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const getRecordStats = useCallback(() => {
    const stats = {
      total: healthRecords.length,
      active: healthRecords.filter(r => r.status === 'Active').length,
      archived: healthRecords.filter(r => r.status === 'Archived').length,
      withPrescriptions: healthRecords.filter(r => 
        r.prescriptions && r.prescriptions.length > 0
      ).length
    };
    return stats;
  }, [healthRecords]);

  const getRecordsByPatient = useCallback((patientId) => {
    return healthRecords.filter(record => 
      record.patient?._id === patientId || record.patient === patientId
    );
  }, [healthRecords]);

  return {
    healthRecords,
    loading,
    error,
    pagination,
    fetchHealthRecords: fetchHealthRecordsAction,
    createHealthRecord: createHealthRecordAction,
    updateHealthRecord: updateHealthRecordAction,
    deleteHealthRecord: deleteHealthRecordAction,
    clearError: clearErrorAction,
    getRecordStats,
    getRecordsByPatient,
  };
};