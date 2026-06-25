import { create } from 'zustand';

export interface UIState {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  activeModule: string;
  selectedOrg: string;
  selectedWorkspace: string;
  commandPaletteOpen: boolean;
  aiAssistantOpen: boolean;
  notifications: Array<{ id: string; message: string; type: 'info' | 'success' | 'warning' | 'error' }>;
  
  toggleTheme: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setActiveModule: (module: string) => void;
  setSelectedOrg: (org: string) => void;
  setSelectedWorkspace: (workspace: string) => void;
  toggleCommandPalette: () => void;
  toggleAIAssistant: () => void;
  addNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  clearNotification: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'dark',
  sidebarCollapsed: false,
  activeModule: 'dashboard',
  selectedOrg: 'RRSS Global Inc.',
  selectedWorkspace: 'Production Enterprise',
  commandPaletteOpen: false,
  aiAssistantOpen: false,
  notifications: [
    { id: '1', message: 'Worker-West-04 has checked in successfully.', type: 'success' },
    { id: '2', message: 'SAP Connection credentials approach expiration (3 days).', type: 'warning' }
  ],

  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    const doc = (globalThis as any).document;
    if (doc) {
      doc.documentElement.setAttribute('data-theme', nextTheme);
    }
    return { theme: nextTheme };
  }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setActiveModule: (module) => set({ activeModule: module }),
  setSelectedOrg: (org) => set({ selectedOrg: org }),
  setSelectedWorkspace: (workspace) => set({ selectedWorkspace: workspace }),
  toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
  toggleAIAssistant: () => set((state) => ({ aiAssistantOpen: !state.aiAssistantOpen })),
  addNotification: (message, type) => set((state) => ({
    notifications: [...state.notifications, { id: Math.random().toString(), message, type }]
  })),
  clearNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id)
  }))
}));
