import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { healthRecordService } from '@/api/services/healthRecordService';
import { toast } from 'sonner';

export const fetchHealthRecords = createAsyncThunk(
  'healthRecords/fetchHealthRecords',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await healthRecordService.getHealthRecords(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch health records');
    }
  }
);

export const createHealthRecord = createAsyncThunk(
  'healthRecords/createHealthRecord',
  async (recordData, { rejectWithValue }) => {
    try {
      const response = await healthRecordService.createHealthRecord(recordData);
      toast.success('Health record created successfully');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create health record');
    }
  }
);

export const updateHealthRecord = createAsyncThunk(
  'healthRecords/updateHealthRecord',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await healthRecordService.updateHealthRecord(id, updateData);
      toast.success('Health record updated successfully');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update health record');
    }
  }
);

export const deleteHealthRecord = createAsyncThunk(
  'healthRecords/deleteHealthRecord',
  async (id, { rejectWithValue }) => {
    try {
      const response = await healthRecordService.deleteHealthRecord(id);
      toast.success('Health record deleted successfully');
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete health record');
    }
  }
);

const healthRecordSlice = createSlice({
  name: 'healthRecords',
  initialState: {
    healthRecords: [],
    loading: false,
    error: null,
    pagination: null
  },
  reducers: {
    clearHealthRecords: (state) => {
      state.healthRecords = [];
      state.pagination = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch health records
      .addCase(fetchHealthRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHealthRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.healthRecords = action.payload.records || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchHealthRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create health record
      .addCase(createHealthRecord.pending, (state) => {
        state.loading = true;
      })
      .addCase(createHealthRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.healthRecords.unshift(action.payload);
      })
      .addCase(createHealthRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update health record
      .addCase(updateHealthRecord.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateHealthRecord.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.healthRecords.findIndex(record => record._id === action.payload._id);
        if (index !== -1) {
          state.healthRecords[index] = action.payload;
        }
      })
      .addCase(updateHealthRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete health record
      .addCase(deleteHealthRecord.fulfilled, (state, action) => {
        state.healthRecords = state.healthRecords.filter(record => record._id !== action.payload.id);
      })
      .addCase(deleteHealthRecord.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { clearHealthRecords, clearError } = healthRecordSlice.actions;
export default healthRecordSlice.reducer;