import api from '../axiosInterceptor';

export const aiChatService = {
  chat: async (message, sessionId = 'default') => {
    const response = await api.post('/ai-chat/chat', { message, sessionId });
    return response.data;
  },

  getHistory: async (sessionId = 'default', limit = 50) => {
    const response = await api.get('/ai-chat/history', {
      params: { sessionId, limit }
    });
    return response.data;
  },

  clearHistory: async (sessionId) => {
    const response = await api.delete('/ai-chat/history', {
      params: { sessionId }
    });
    return response.data;
  }
};