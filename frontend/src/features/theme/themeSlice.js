import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  const storedTheme = localStorage.getItem('caresync-theme');
  if (storedTheme) {
    return storedTheme;
  }
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

const initialState = {
  mode: getInitialTheme(),
  sidebarCollapsed: localStorage.getItem('caresync-sidebar-collapsed') === 'true',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('caresync-theme', state.mode);
      themeSlice.caseReducers.applyTheme(state);
    },
    
    setTheme: (state, action) => {
      const validThemes = ['light', 'dark', 'auto'];
      if (validThemes.includes(action.payload)) {
        if (action.payload === 'auto') {
          state.mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        } else {
          state.mode = action.payload;
        }
        localStorage.setItem('caresync-theme', state.mode);
        themeSlice.caseReducers.applyTheme(state);
      }
    },
    
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      localStorage.setItem('caresync-sidebar-collapsed', state.sidebarCollapsed);
    },
    
    setSidebar: (state, action) => {
      state.sidebarCollapsed = action.payload;
      localStorage.setItem('caresync-sidebar-collapsed', action.payload);
    },
    
    applyTheme: (state) => {
      const root = document.documentElement;
      
      if (state.mode === 'dark') {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }

      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        const themeColor = state.mode === 'dark' ? '#1e293b' : '#f8fafc';
        metaThemeColor.setAttribute('content', themeColor);
      }
    },
    
    initializeTheme: (state) => {
      themeSlice.caseReducers.applyTheme(state);

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemThemeChange = (e) => {
        if (localStorage.getItem('caresync-theme') === 'auto') {
          state.mode = e.matches ? 'dark' : 'light';
          themeSlice.caseReducers.applyTheme(state);
        }
      };

      mediaQuery.addEventListener('change', handleSystemThemeChange);
    },
    
    resetTheme: (state) => {
      state.mode = 'light';
      state.sidebarCollapsed = false;
      localStorage.removeItem('caresync-theme');
      localStorage.removeItem('caresync-sidebar-collapsed');
      themeSlice.caseReducers.applyTheme(state);
    }
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebar,
  applyTheme,
  initializeTheme,
  resetTheme,
} = themeSlice.actions;

export default themeSlice.reducer;