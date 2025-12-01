import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import {
  toggleTheme,
  setTheme,
  initializeTheme,
  applyTheme,
} from '@/features/theme/themeSlice';

export const useTheme = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);

  useEffect(() => {
    dispatch(initializeTheme());
  }, [dispatch]);

  const toggle = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  const set = useCallback((mode) => {
    dispatch(setTheme(mode));
  }, [dispatch]);

  const apply = useCallback(() => {
    dispatch(applyTheme());
  }, [dispatch]);

  return {
    mode: theme.mode,
    sidebarCollapsed: theme.sidebarCollapsed,
    toggleTheme: toggle,
    setTheme: set,
    applyTheme: apply,
    isDark: theme.mode === 'dark',
    isLight: theme.mode === 'light',
    isAuto: localStorage.getItem('caresync-theme') === 'auto',
  };
};