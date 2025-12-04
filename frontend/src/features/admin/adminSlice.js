import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axiosInterceptor";

export const fetchAdminStats = createAsyncThunk(
  "admin/fetchAdminStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/stats");
      return response.data.data; // { totalUsers, totalDoctors, totalPatients, todayAppointments, activeRecords }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load admin stats");
    }
  }
);

const initialState = {
  stats: null,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
