// src/features/hospitals/hospitalSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { hospitalService } from "@/api/services/hospitalService";
import { toast } from "sonner";

// GET all hospitals
export const fetchHospitals = createAsyncThunk(
  "hospitals/fetchHospitals",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await hospitalService.getHospitals(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load hospitals");
    }
  }
);

// GET by ID
export const fetchHospitalById = createAsyncThunk(
  "hospitals/fetchHospitalById",
  async (id, { rejectWithValue }) => {
    try {
      return await hospitalService.getHospitalById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load hospital");
    }
  }
);

// CREATE
export const createHospital = createAsyncThunk(
  "hospitals/createHospital",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await hospitalService.createHospital(payload);
      toast.success("Hospital created successfully");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create hospital");
    }
  }
);

// SLICE
const hospitalSlice = createSlice({
  name: "hospitals",
  initialState: {
    hospitals: [],
    hospital: null,
    pagination: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearHospitalError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch list
      .addCase(fetchHospitals.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchHospitals.fulfilled, (s, a) => {
        s.loading = false;
        s.hospitals = a.payload.hospitals;
        s.pagination = a.payload.pagination;
      })
      .addCase(fetchHospitals.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
        toast.error(a.payload);
      })

      // Fetch by ID
      .addCase(fetchHospitalById.pending, (s) => { s.loading = true; })
      .addCase(fetchHospitalById.fulfilled, (s, a) => {
        s.loading = false;
        s.hospital = a.payload;
      })
      .addCase(fetchHospitalById.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
        toast.error(a.payload);
      })

      // Create
      .addCase(createHospital.pending, (s) => { s.loading = true; })
      .addCase(createHospital.fulfilled, (s, a) => {
        s.loading = false;
        s.hospitals.unshift(a.payload);
      })
      .addCase(createHospital.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
        toast.error(a.payload);
      });
  }
});

export const { clearHospitalError } = hospitalSlice.actions;
export default hospitalSlice.reducer;
