import { create } from 'zustand';
import { apiRequest } from '../services/ApiClient';

export interface WorkerInfo {
  id: string;
  hostname: string;
  status: string;
  capabilities: any;
  concurrencyLimit: number;
  activeJobCount: number;
  registeredAt: string;
}

export interface CredentialInfo {
  id: string;
  name: string;
  type: string;
  status: string;
  provider: string;
  scope: string;
  ownerId: string;
  metadata: any;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceInfo {
  id: string;
  name: string;
  slug: string;
  status: string;
}

export interface UIState {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  activeModule: string;
  selectedOrg: string;
  selectedWorkspace: string;
  commandPaletteOpen: boolean;
  aiAssistantOpen: boolean;
  notifications: Array<{ id: string; message: string; type: 'info' | 'success' | 'warning' | 'error' }>;
  
  // Real API State
  workers: WorkerInfo[];
  credentials: CredentialInfo[];
  workspaces: WorkspaceInfo[];
  isLoading: boolean;
  
  toggleTheme: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setActiveModule: (module: string) => void;
  setSelectedOrg: (org: string) => void;
  setSelectedWorkspace: (workspace: string) => void;
  toggleCommandPalette: () => void;
  toggleAIAssistant: () => void;
  addNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  clearNotification: (id: string) => void;

  // Real API Actions
  fetchWorkers: () => Promise<void>;
  fetchCredentials: () => Promise<void>;
  fetchWorkspaces: () => Promise<void>;
  createCredential: (data: { name: string; type: string; provider: string; scope: string; ownerId: string; plainTextSecret: string; metadata?: any; policy?: any }) => Promise<void>;
  rotateCredential: (id: string, plainTextSecret: string) => Promise<void>;
}

export const useUIStore = create<UIState>((set, get) => ({
  theme: 'dark',
  sidebarCollapsed: false,
  activeModule: 'dashboard',
  selectedOrg: 'RRSS Global Inc.',
  selectedWorkspace: 'Production Enterprise',
  commandPaletteOpen: false,
  aiAssistantOpen: false,
  notifications: [],
  workers: [],
  credentials: [],
  workspaces: [],
  isLoading: false,

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
  })),

  // API Call Implementations
  fetchWorkers: async () => {
    set({ isLoading: true });
    try {
      const data = await apiRequest<WorkerInfo[]>('/workers');
      set({ workers: data || [] });
    } catch (e) {
      get().addNotification('Failed to retrieve active workers from API.', 'error');
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCredentials: async () => {
    set({ isLoading: true });
    try {
      const data = await apiRequest<CredentialInfo[]>('/credentials');
      set({ credentials: data || [] });
    } catch (e) {
      get().addNotification('Failed to retrieve credentials from Vault API.', 'error');
    } finally {
      set({ isLoading: false });
    }
  },

  fetchWorkspaces: async () => {
    set({ isLoading: true });
    try {
      const data = await apiRequest<WorkspaceInfo[]>('/workspaces');
      set({ workspaces: data || [] });
      if (data && data.length > 0) {
        set({ selectedWorkspace: data[0].name });
      }
    } catch (e) {
      get().addNotification('Failed to retrieve active workspaces from API.', 'error');
    } finally {
      set({ isLoading: false });
    }
  },

  createCredential: async (data) => {
    try {
      await apiRequest('/credentials', {
        method: 'POST',
        body: data
      });
      get().addNotification(`Credential '${data.name}' registered inside the vault.`, 'success');
      await get().fetchCredentials();
    } catch (e) {
      get().addNotification('Failed to write credential to the vault.', 'error');
      throw e;
    }
  },

  rotateCredential: async (id, plainTextSecret) => {
    try {
      await apiRequest(`/credentials/${id}/rotate`, {
        method: 'POST',
        body: { plainTextSecret }
      });
      get().addNotification('Credential rotated successfully.', 'success');
      await get().fetchCredentials();
    } catch (e) {
      get().addNotification('Failed to rotate vault credential.', 'error');
      throw e;
    }
  }
}));
