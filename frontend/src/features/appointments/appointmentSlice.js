// src/features/appointments/appointmentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axiosInterceptor";
import { toast } from "sonner";

// GET /appointments  (with filters + pagination)
export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAppointments",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/appointments", { params });
      // response.data.data => { appointments, pagination }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load appointments"
      );
    }
  }
);

// GET /appointments/:id
export const fetchAppointmentById = createAsyncThunk(
  "appointments/fetchAppointmentById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/appointments/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load appointment"
      );
    }
  }
);

// POST /appointments
export const createAppointment = createAsyncThunk(
  "appointments/createAppointment",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/appointments", payload);
      toast.success("Appointment created successfully");
      // Optionally refresh list
      dispatch(fetchAppointments({}));
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create appointment"
      );
    }
  }
);

// PATCH /appointments/:id
export const updateAppointment = createAsyncThunk(
  "appointments/updateAppointment",
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.patch(`/appointments/${id}`, data);
      toast.success("Appointment updated");
      dispatch(fetchAppointments({}));
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update appointment"
      );
    }
  }
);

// POST /appointments/:id/cancel
export const cancelAppointment = createAsyncThunk(
  "appointments/cancelAppointment",
  async ({ id, cancellationReason }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post(`/appointments/${id}/cancel`, {
        cancellationReason,
      });
      toast.success("Appointment cancelled");
      dispatch(fetchAppointments({}));
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel appointment"
      );
    }
  }
);

// GET /appointments/doctor/slots/available
export const fetchAvailableSlots = createAsyncThunk(
  "appointments/fetchAvailableSlots",
  async ({ doctorId, date, consultationType = "In-Person" }, { rejectWithValue }) => {
    try {
      const response = await api.get("/appointments/doctor/slots/available", {
        params: { doctorId, date, consultationType },
      });
      // data: { doctor, date, consultationHours, availableSlots, totalSlots }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load slots"
      );
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
  slots: {
    loading: false,
    data: null,
    error: null,
  },
  filters: {
    status: "",
    startDate: "",
    endDate: "",
  },
  loading: false,
  error: null,
};

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    setAppointmentFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentAppointment: (state) => {
      state.current = null;
    },
    clearSlots: (state) => {
      state.slots = {
        loading: false,
        data: null,
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // LIST
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.appointments || [];
        state.pagination =
          action.payload.pagination || initialState.pagination;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // SINGLE
      .addCase(fetchAppointmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchAppointmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAppointment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateAppointment.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAppointment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CANCEL
      .addCase(cancelAppointment.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelAppointment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // AVAILABLE SLOTS
      .addCase(fetchAvailableSlots.pending, (state) => {
        state.slots.loading = true;
        state.slots.error = null;
      })
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        state.slots.loading = false;
        state.slots.data = action.payload;
      })
      .addCase(fetchAvailableSlots.rejected, (state, action) => {
        state.slots.loading = false;
        state.slots.error = action.payload;
      });
  },
});

export const {
  setAppointmentFilters,
  clearCurrentAppointment,
  clearSlots,
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;
