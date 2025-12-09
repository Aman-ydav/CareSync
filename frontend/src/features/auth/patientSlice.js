import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axiosInterceptor";

export const fetchPatients = createAsyncThunk(
  "patient/fetchAll",
  async () => {
    const res = await api.get("/users/patients");
    return res.data.data;
  }
);

export const fetchPatientProfile = createAsyncThunk(
  "patient/fetchOne",
  async (id) => {
    const res = await api.get(`/users/patient/${id}`);
    return res.data.data;
  }
);

const patientSlice = createSlice({
  name: "patient",
  initialState: { list: [], patient: null, loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (st) => { st.loading = true })
      .addCase(fetchPatients.fulfilled, (st, action) => {
        st.loading = false;
        st.list = action.payload;
      })
      .addCase(fetchPatientProfile.pending, (st) => { st.loading = true })
      .addCase(fetchPatientProfile.fulfilled, (st, action) => {
        st.loading = false;
        st.patient = action.payload;
      })
  }
});

export default patientSlice.reducer;
