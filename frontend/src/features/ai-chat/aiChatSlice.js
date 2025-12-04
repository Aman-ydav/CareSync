import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { aiChatService } from '@/api/services/aiChatService';
import { toast } from 'sonner';

export const sendMessage = createAsyncThunk(
  'aiChat/sendMessage',
  async ({ message, sessionId = 'default' }, { rejectWithValue }) => {
    try {
      const response = await aiChatService.chat(message, sessionId);
      return {
        userMessage: message,
        aiResponse: response.data?.response || 'No response from AI',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get AI response');
    }
  }
);

export const fetchChatHistory = createAsyncThunk(
  'aiChat/fetchChatHistory',
  async ({ sessionId = 'default', limit = 50 }, { rejectWithValue }) => {
    try {
      const response = await aiChatService.getHistory(sessionId, limit);
      return response.data?.messages || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch chat history');
    }
  }
);

export const clearChatHistory = createAsyncThunk(
  'aiChat/clearChatHistory',
  async (sessionId, { rejectWithValue }) => {
    try {
      await aiChatService.clearHistory(sessionId);
      toast.success('Chat history cleared');
      return sessionId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear chat history');
    }
  }
);

const aiChatSlice = createSlice({
  name: 'aiChat',
  initialState: {
    messages: [],
    history: [],
    loading: false,
    error: null,
    activeSession: 'default'
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setActiveSession: (state, action) => {
      state.activeSession = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(
          { role: 'user', content: action.payload.userMessage, timestamp: action.payload.timestamp },
          { role: 'assistant', content: action.payload.aiResponse, timestamp: action.payload.timestamp }
        );
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Fetch chat history
      .addCase(fetchChatHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Clear chat history
      .addCase(clearChatHistory.fulfilled, (state, action) => {
        if (action.payload === state.activeSession) {
          state.messages = [];
        }
        state.history = state.history.filter(msg => msg.sessionId !== action.payload);
      });
  }
});

export const { addMessage, clearMessages, setActiveSession, clearError } = aiChatSlice.actions;
export default aiChatSlice.reducer;