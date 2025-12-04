import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import {
  sendChatMessage,
  fetchChatHistory,
  clearChat,
  fetchChatSessions,
  addMessage,
  setCurrentSession,
  clearMessages,
  showDisclaimer,
} from "@/features/aiChat/aiChatSlice";

export const useAIChat = () => {
  const dispatch = useDispatch();
  const {
    messages,
    sessions,
    currentSession,
    loading,
    streaming,
    error,
    disclaimerShown,
  } = useSelector((state) => state.aiChat);

  const sendMessage = useCallback((message, sessionId = currentSession) => {
    return dispatch(sendChatMessage({ message, sessionId }));
  }, [dispatch, currentSession]);

  const getChatHistory = useCallback((sessionId = currentSession, limit = 50) => {
    return dispatch(fetchChatHistory({ sessionId, limit }));
  }, [dispatch, currentSession]);

  const clearChatHistory = useCallback((sessionId = null) => {
    return dispatch(clearChat(sessionId));
  }, [dispatch]);

  const getSessions = useCallback(() => {
    return dispatch(fetchChatSessions());
  }, [dispatch]);

  const switchSession = useCallback((sessionId) => {
    dispatch(setCurrentSession(sessionId));
    getChatHistory(sessionId);
  }, [dispatch, getChatHistory]);

  const addLocalMessage = useCallback((message, type = "user") => {
    dispatch(addMessage({
      type,
      content: message,
      timestamp: new Date().toISOString(),
    }));
  }, [dispatch]);

  const clearLocalMessages = useCallback(() => {
    dispatch(clearMessages());
  }, [dispatch]);

  const displayDisclaimer = useCallback(() => {
    dispatch(showDisclaimer());
  }, [dispatch]);

  useEffect(() => {
    getChatHistory();
    getSessions();
  }, []);

  return {
    messages,
    sessions,
    currentSession,
    loading,
    streaming,
    error,
    disclaimerShown,
    sendMessage,
    getChatHistory,
    clearChatHistory,
    getSessions,
    switchSession,
    addLocalMessage,
    clearLocalMessages,
    displayDisclaimer,
  };
};