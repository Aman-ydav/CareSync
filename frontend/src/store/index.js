import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import appointmentsReducer from "@/features/appointments/appointmentSlice";
import healthRecordsReducer from "@/features/healthRecords/healthRecordSlice";
import aiChatReducer from "@/features/aiChat/aiChatSlice";
import adminReducer from "@/features/admin/adminSlice";
import themeReducer from "@/features/theme/themeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    appointments: appointmentsReducer,
    healthRecords: healthRecordsReducer,
    aiChat: aiChatReducer,
    admin: adminReducer,
    theme: themeReducer,
  },
});
