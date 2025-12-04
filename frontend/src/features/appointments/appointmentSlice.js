import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { appointmentService } from "@/api/services/appointmentService";
import { toast } from "sonner";

/**
 * Fetch List
 */
export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAppointments",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await appointmentService.getAppointments(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

/**
 * Fetch Single
 */
export const fetchAppointmentById = createAsyncThunk(
  "appointments/fetchAppointmentById",
  async (id, { rejectWithValue }) => {
    try {
      return await appointmentService.getAppointmentById(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

/**
 * Fetch Slots
 */
export const fetchSlots = createAsyncThunk(
  "appointments/fetchSlots",
  async (params, { rejectWithValue }) => {
    try {
      return await appointmentService.getAvailableSlots(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

/**
 * Create Appointment
 */
export const createAppointment = createAsyncThunk(
  "appointments/createAppointment",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await appointmentService.createAppointment(payload);
      toast.success("Appointment booked successfully");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

/**
 * Cancel Appointment
 */
export const cancelAppointment = createAsyncThunk(
  "appointments/cancelAppointment",
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const data = await appointmentService.cancelAppointment(id, reason);
      toast.success("Appointment cancelled");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

const appointmentSlice = createSlice({
  name: "appointments",
  initialState: {
    list: [],
    pagination: null,
    appointment: null,
    slots: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAppointmentError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload.appointments;
        s.pagination = a.payload.pagination;
      })
      .addCase(fetchAppointments.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      .addCase(fetchAppointmentById.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchAppointmentById.fulfilled, (s, a) => {
        s.loading = false;
        s.appointment = a.payload;
      })
      .addCase(fetchAppointmentById.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      .addCase(fetchSlots.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchSlots.fulfilled, (s, a) => {
        s.loading = false;
        s.slots = a.payload.availableSlots;
      })
      .addCase(fetchSlots.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      .addCase(createAppointment.pending, (s) => {
        s.loading = true;
      })
      .addCase(createAppointment.fulfilled, (s) => {
        s.loading = false;
      })
      .addCase(createAppointment.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      });

  }
});

export const { clearAppointmentError } = appointmentSlice.actions;
export default appointmentSlice.reducer;
