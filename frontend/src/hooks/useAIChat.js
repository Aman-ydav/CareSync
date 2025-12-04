import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  sendMessage,
  fetchChatHistory,
  clearChatHistory,
  addMessage,
  clearMessages,
  setActiveSession,
  clearError,
} from '@/features/ai-chat/aiChatSlice';

export const useAIChat = () => {
  const dispatch = useDispatch();
  const { messages, history, loading, error, activeSession } = useSelector((state) => state.aiChat);

  const sendMessageAction = useCallback((message, sessionId) => {
    return dispatch(sendMessage({ message, sessionId })).unwrap();
  }, [dispatch]);

  const fetchChatHistoryAction = useCallback((sessionId, limit) => {
    return dispatch(fetchChatHistory({ sessionId, limit })).unwrap();
  }, [dispatch]);

  const clearChatHistoryAction = useCallback((sessionId) => {
    return dispatch(clearChatHistory(sessionId)).unwrap();
  }, [dispatch]);

  const addMessageAction = useCallback((message) => {
    dispatch(addMessage(message));
  }, [dispatch]);

  const clearMessagesAction = useCallback(() => {
    dispatch(clearMessages());
  }, [dispatch]);

  const setActiveSessionAction = useCallback((sessionId) => {
    dispatch(setActiveSession(sessionId));
  }, [dispatch]);

  const clearErrorAction = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    messages,
    history,
    loading,
    error,
    activeSession,
    sendMessage: sendMessageAction,
    fetchChatHistory: fetchChatHistoryAction,
    clearChatHistory: clearChatHistoryAction,
    addMessage: addMessageAction,
    clearMessages: clearMessagesAction,
    setActiveSession: setActiveSessionAction,
    clearError: clearErrorAction,
  };
};