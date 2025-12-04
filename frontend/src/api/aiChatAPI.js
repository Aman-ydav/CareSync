import api from "./axiosInterceptor";

export const aiChatAPI = {
  // Send message to AI
  chatWithAI: async (message, sessionId = "default") => {
    const response = await api.post("/ai-chat", { message, sessionId });
    return response.data;
  },

  // Get chat history
  getChatHistory: async (sessionId = "default", limit = 50) => {
    const response = await api.get("/ai-chat/history", { params: { sessionId, limit } });
    return response.data;
  },

  // Clear chat history
  clearChatHistory: async (sessionId = null) => {
    const response = await api.delete("/ai-chat/history", { params: { sessionId } });
    return response.data;
  },

  // Get recent sessions
  getChatSessions: async () => {
    const response = await api.get("/ai-chat/sessions");
    return response.data;
  },
};