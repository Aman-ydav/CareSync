import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axiosInterceptor";
import { toast } from "sonner";

export const fetchHealthRecords = createAsyncThunk(
  "healthRecords/fetchHealthRecords",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/health-records", { params });
      return response.data.data; // { records, pagination }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load health records");
    }
  }
);

export const fetchHealthRecordById = createAsyncThunk(
  "healthRecords/fetchHealthRecordById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/health-records/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load health record");
    }
  }
);

export const createHealthRecord = createAsyncThunk(
  "healthRecords/createHealthRecord",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/health-records", payload);
      toast.success("Health record created");
      dispatch(fetchHealthRecords({}));
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create health record");
    }
  }
);

export const updateHealthRecord = createAsyncThunk(
  "healthRecords/updateHealthRecord",
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.patch(`/health-records/${id}`, data);
      toast.success("Health record updated");
      dispatch(fetchHealthRecords({}));
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update health record");
    }
  }
);

export const deleteHealthRecord = createAsyncThunk(
  "healthRecords/deleteHealthRecord",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`/health-records/${id}`);
      toast.success("Health record deleted");
      dispatch(fetchHealthRecords({}));
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete health record");
    }
  }
);

const initialState = {
  list: [],
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false,
  },
  current: null,
  loading: false,
  error: null,
};

const healthRecordsSlice = createSlice({
  name: "healthRecords",
  initialState,
  reducers: {
    clearCurrentRecord: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHealthRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHealthRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.records || [];
        state.pagination = action.payload.pagination || initialState.pagination;
      })
      .addCase(fetchHealthRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchHealthRecordById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHealthRecordById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchHealthRecordById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createHealthRecord.pending, (state) => {
        state.loading = true;
      })
      .addCase(createHealthRecord.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createHealthRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateHealthRecord.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateHealthRecord.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateHealthRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteHealthRecord.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteHealthRecord.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteHealthRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentRecord } = healthRecordsSlice.actions;
export default healthRecordsSlice.reducer;
