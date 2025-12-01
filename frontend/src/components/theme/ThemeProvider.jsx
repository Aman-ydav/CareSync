import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeTheme, applyTheme } from '@/features/theme/themeSlice';

const ThemeProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);

  useEffect(() => {
    dispatch(initializeTheme());
  }, [dispatch]);

  useEffect(() => {
    dispatch(applyTheme());
  }, [mode, dispatch]);

  return <>{children}</>;
};

export default ThemeProvider;