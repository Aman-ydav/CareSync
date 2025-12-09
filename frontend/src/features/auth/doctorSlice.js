import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axiosInterceptor";

export const fetchDoctors = createAsyncThunk(
  "doctor/fetchAll",
  async () => {
    const res = await api.get("/users/doctors");
    return res.data.data;
  }
);

export const fetchDoctorProfile = createAsyncThunk(
  "doctor/fetchOne",
  async (id) => {
    const res = await api.get(`/users/doctor/${id}`);
    return res.data.data;
  }
);

const doctorSlice = createSlice({
  name: "doctor",
  initialState: { list: [], doctor: null, loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (st) => { st.loading = true })
      .addCase(fetchDoctors.fulfilled, (st, action) => {
        st.loading = false;
        st.list = action.payload;
      })
      .addCase(fetchDoctorProfile.pending, (st) => { st.loading = true })
      .addCase(fetchDoctorProfile.fulfilled, (st, action) => {
        st.loading = false;
        st.doctor = action.payload;
      })
  }
});

export default doctorSlice.reducer;
