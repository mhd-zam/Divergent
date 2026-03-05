import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppSettings, ThemeMode } from '../../../shared/types';

interface SettingsState extends AppSettings {
    sidebarOpen: boolean;

    setTheme: (theme: ThemeMode) => void;
    toggleTheme: () => void;
    setApiBaseUrl: (url: string) => void;
    setFontSize: (size: number) => void;
    setSidebarOpen: (open: boolean) => void;
    toggleSidebar: () => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001',
            theme: 'dark' as ThemeMode,
            fontSize: 14,
            sidebarOpen: true,

            setTheme: (theme) => set({ theme }),
            toggleTheme: () =>
                set((state) => ({
                    theme: state.theme === 'dark' ? 'light' : 'dark',
                })),
            setApiBaseUrl: (apiBaseUrl) => set({ apiBaseUrl }),
            setFontSize: (fontSize) => set({ fontSize }),
            setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
            toggleSidebar: () =>
                set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        }),
        {
            name: 'divergent-settings',
        }
    )
);
