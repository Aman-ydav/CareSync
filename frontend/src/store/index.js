import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import themeReducer from "@/features/theme/themeSlice";
import appointmentReducer from "@/features/appointments/appointmentSlice";
import healthRecordReducer from "@/features/health-records/healthRecordSlice";
import hospitalReducer from "@/features/hospitals/hospitalSlice";
import aiChatReducer from "@/features/ai-chat/aiChatSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    appointments: appointmentReducer,
    healthRecords: healthRecordReducer,
    hospitals: hospitalReducer,
    aiChat: aiChatReducer,
  },
});