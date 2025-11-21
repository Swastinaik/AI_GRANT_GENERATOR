import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
}

// This store is specifically for the theme
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light', // The default theme
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
    }),
    {
      name: 'theme-storage', // The key in localStorage
      storage: createJSONStorage(() => localStorage), // <-- Use localStorage
    }
  )
);