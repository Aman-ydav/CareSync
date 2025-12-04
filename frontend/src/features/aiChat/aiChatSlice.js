import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axiosInterceptor";
import { toast } from "sonner";
import crypto from "crypto";

export const sendAiMessage = createAsyncThunk(
  "aiChat/sendAiMessage",
  async ({ message, sessionId = "default" }, { rejectWithValue }) => {
    try {
      const response = await api.post("/ai-chat/chat", { message, sessionId });
      return {
        message,
        sessionId,
        response: response.data.data.response,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send message"
      );
    }
  }
);

export const fetchChatHistory = createAsyncThunk(
  "aiChat/fetchChatHistory",
  async ({ sessionId = "default", limit = 50 }, { rejectWithValue }) => {
    try {
      const response = await api.get("/ai-chat/history", {
        params: { sessionId, limit },
      });
      return {
        sessionId,
        messages: response.data.data.messages || [],
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load chat history"
      );
    }
  }
);

export const clearChatHistory = createAsyncThunk(
  "aiChat/clearChatHistory",
  async ({ sessionId = "default" }, { rejectWithValue }) => {
    try {
      await api.delete("/ai-chat/history", { params: { sessionId } });
      return { sessionId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear chat history"
      );
    }
  }
);

const initialState = {
  sessions: {
    default: {
      messages: [], // { message, response, createdAt }
    },
  },
  activeSessionId: "default",
  sending: false,
  loadingHistory: false,
  error: null,
};

const aiChatSlice = createSlice({
  name: "aiChat",
  initialState,
  reducers: {
    setActiveSession: (state, action) => {
      state.activeSessionId = action.payload;
      if (!state.sessions[action.payload]) {
        state.sessions[action.payload] = { messages: [] };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendAiMessage.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(sendAiMessage.fulfilled, (state, action) => {
        state.sending = false;
        const { sessionId, message, response } = action.payload;
        const session = state.sessions[sessionId] || { messages: [] };

        session.messages.push({
          id: Math.random().toString(36).slice(2),
          message,
          response,
          createdAt: new Date().toISOString(),
        });

        state.sessions[sessionId] = session;
      })
      .addCase(sendAiMessage.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(fetchChatHistory.pending, (state) => {
        state.loadingHistory = true;
        state.error = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.loadingHistory = false;
        const { sessionId, messages } = action.payload;
        state.sessions[sessionId] = {
          messages: messages || [],
        };
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.loadingHistory = false;
        state.error = action.payload;
      })
      .addCase(clearChatHistory.fulfilled, (state, action) => {
        const { sessionId } = action.payload;
        state.sessions[sessionId] = { messages: [] };
      });
  },
});

export const { setActiveSession } = aiChatSlice.actions;
export default aiChatSlice.reducer;
