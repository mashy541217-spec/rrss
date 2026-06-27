import { create } from 'zustand';
import { translations } from './translations';
import type { LocaleType, Translations } from './translations';

export interface BusinessInfo {
  id: string;
  name: string;
  category: string;
  socialAccountsCount: number;
  logoUrl?: string;
  brandColor?: string;
  emailBrand?: any;
}

export type BusinessTab = 'dashboard' | 'channels' | 'campaigns' | 'media' | 'team' | 'settings' | 'health' | 'notifications';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'Active' | 'Pending';
  avatarInitials: string;
}

export interface BusinessNotification {
  id: string;
  businessId: string;
  message: string;
  type: 'success' | 'info' | 'error' | 'warning';
  timestamp: string;
}

export interface SocialAccountInfo {
  id: string;
  name: string;
  provider: string;
  status: 'CONNECTED' | 'SYNCHRONIZING' | 'NEEDS_ATTENTION' | 'DISCONNECTED';
  username?: string;
  avatarUrl?: string;
  businessId: string;
}

export interface ProvisioningStatusInfo {
  id: string;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  steps: Array<{
    name: string;
    status: 'pending' | 'processing' | 'success' | 'failed';
    message?: string;
  }>;
}

export interface WorkspaceStoreState {
  isOnboarded: boolean;
  currentStep: number;
  activeModule: 'dashboard' | 'social' | 'businesses' | 'automation' | 'calendar' | 'media' | 'analytics' | 'assistant' | 'marketplace' | 'reports' | 'settings';
  organizationName: string;
  workspaceId: string;
  workspaceName: string;
  workspaceSlug: string;
  timezone: string;
  locale: string;
  businesses: BusinessInfo[];
  socialAccounts: SocialAccountInfo[];
  notifications: Array<{ id: string; message: string; type: 'success' | 'info' | 'error' }>;
  activeProvisioning: ProvisioningStatusInfo | null;
  language: LocaleType;
  theme: 'dark' | 'light';
  brandColor: string;
  t: Translations;
  activeBusinessId: string;
  businessTemplate: string;
  activeBusinessTab: BusinessTab;
  businessTeam: Record<string, TeamMember[]>;
  businessNotifications: Record<string, BusinessNotification[]>;
  businessHealthScore: Record<string, number>;
  
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  setOrganizationName: (name: string) => void;
  createWorkspace: (data: { name: string; slug: string; timezone: string; locale: string }) => Promise<string>;
  addBusiness: (name: string, category: string) => Promise<void>;
  addNotification: (message: string, type: 'success' | 'info' | 'error') => void;
  clearNotification: (id: string) => void;
  setActiveModule: (module: 'dashboard' | 'social' | 'businesses' | 'automation' | 'calendar' | 'media' | 'analytics' | 'assistant' | 'marketplace' | 'reports' | 'settings') => void;
  completeOnboarding: () => void;
  clearActiveProvisioning: () => void;
  setLanguage: (lang: LocaleType) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setBrandColor: (color: string) => void;
  setActiveBusinessId: (id: string) => void;
  setBusinessTemplate: (template: string) => void;
  setActiveBusinessTab: (tab: BusinessTab) => void;
  updateBusiness: (id: string, data: { name?: string; logoUrl?: string; brandColor?: string; emailBrand?: any }) => Promise<void>;
  addTeamMember: (businessId: string, member: TeamMember) => void;
  removeTeamMember: (businessId: string, memberId: string) => void;
  addBusinessNotification: (notification: Omit<BusinessNotification, 'id' | 'timestamp'>) => void;
  
  connectSocialAccount: (provider: string, name: string) => Promise<void>;
  disconnectSocialAccount: (accountId: string) => Promise<void>;
}

export const useWorkspaceStore = create<WorkspaceStoreState>((set, get) => ({
  isOnboarded: false,
  currentStep: 1,
  activeModule: 'dashboard',
  organizationName: '',
  workspaceId: '',
  workspaceName: '',
  workspaceSlug: '',
  timezone: 'America/New_York',
  locale: 'en-US',
  businesses: [],
  socialAccounts: [],
  notifications: [],
  activeProvisioning: null,
  language: 'en',
  theme: 'dark',
  brandColor: '#8b5cf6',
  t: translations['en'],
  activeBusinessId: '',
  businessTemplate: '',
  activeBusinessTab: 'dashboard',
  businessTeam: {},
  businessNotifications: {},
  businessHealthScore: {},

  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 6) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
  setStep: (step) => set({ currentStep: step }),
  setOrganizationName: (name) => set({ organizationName: name }),
  
  createWorkspace: async (data) => {
    try {
      const response = await fetch('http://localhost:3000/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          slug: data.slug,
          timezone: data.timezone,
          locale: data.locale,
          ownerId: 'user-customer-99',
          limits: {
            maxBusinesses: 10,
            maxConcurrentExecutions: 50,
            maxProxies: 10,
            maxVms: 5
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create workspace on backend');
      }

      const listResponse = await fetch('http://localhost:3000/workspaces');
      const list = await listResponse.json();
      const created = list.find((w: any) => w.slug === data.slug) || { id: `ws-${Date.now()}` };

      set({
        workspaceId: created.id,
        workspaceName: data.name,
        workspaceSlug: data.slug,
        timezone: data.timezone,
        locale: data.locale
      });

      get().addNotification(`Workspace "${data.name}" created successfully!`, 'success');
      return created.id;
    } catch (err) {
      console.error(err);
      const mockId = `ws-${Date.now()}`;
      set({
        workspaceId: mockId,
        workspaceName: data.name,
        workspaceSlug: data.slug,
        timezone: data.timezone,
        locale: data.locale
      });
      get().addNotification(`Offline mode: Created Workspace "${data.name}" locally.`, 'info');
      return mockId;
    }
  },

  addBusiness: async (name, category) => {
    const wsId = get().workspaceId || 'ws-default';
    try {
      const response = await fetch(`http://localhost:3000/workspaces/${wsId}/businesses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category })
      });
      if (response.ok) {
        const created = await response.json();
        set((state) => {
          const nextBusinesses = [...state.businesses, {
            id: created.id,
            name: created.name,
            category: created.category,
            socialAccountsCount: 0,
            logoUrl: created.logoUrl || undefined,
            brandColor: created.brandColor || undefined,
            emailBrand: created.emailBrand || undefined
          }];
          return {
            businesses: nextBusinesses,
            activeBusinessId: state.activeBusinessId || created.id
          };
        });
        get().addNotification(`Business Unit "${name}" registered successfully on backend.`, 'success');
      }
    } catch (err) {
      console.warn('Backend business API offline, fallback to local registration:', err);
      const tempId = `bus-${Date.now()}`;
      set((state) => ({
        businesses: [...state.businesses, { id: tempId, name, category, socialAccountsCount: 0, logoUrl: undefined, brandColor: '#8b5cf6', emailBrand: {} }],
        activeBusinessId: state.activeBusinessId || tempId
      }));
      get().addNotification(`Registered Business "${name}" locally.`, 'info');
    }
  },

  updateBusiness: async (id, data) => {
    try {
      const response = await fetch(`http://localhost:3000/businesses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        const updated = await response.json();
        set((state) => ({
          businesses: state.businesses.map(b => b.id === id ? {
            ...b,
            name: updated.name,
            category: updated.category,
            logoUrl: updated.logoUrl || undefined,
            brandColor: updated.brandColor || undefined,
            emailBrand: updated.emailBrand || undefined
          } : b)
        }));
        get().addNotification(`Business settings updated successfully.`, 'success');
      }
    } catch (err) {
      console.warn('Backend update business API offline, update locally:', err);
      set((state) => ({
        businesses: state.businesses.map(b => b.id === id ? {
          ...b,
          ...data
        } : b)
      }));
      get().addNotification(`Updated Business settings locally.`, 'info');
    }
  },

  connectSocialAccount: async (provider, name) => {
    const { activeBusinessId } = get();
    if (!activeBusinessId) return;

    set({
      activeProvisioning: {
        id: `prov-${Date.now()}`,
        status: 'PROCESSING',
        steps: [
          { name: 'Setting up secure connection', status: 'success' },
          { name: 'Securing Workspace Link', status: 'success' },
          { name: 'Validating Connection', status: 'processing' }
        ]
      }
    });

    await new Promise(resolve => setTimeout(resolve, 1500));

    set((state) => {
      const newAccount: SocialAccountInfo = {
        id: `soc-${Date.now()}`,
        name,
        provider,
        status: 'CONNECTED',
        username: name.toLowerCase().replace(/\s+/g, '_'),
        businessId: activeBusinessId
      };
      
      return {
        socialAccounts: [...state.socialAccounts, newAccount],
        activeProvisioning: {
          ...state.activeProvisioning!,
          status: 'COMPLETED',
          steps: [
            ...state.activeProvisioning!.steps.slice(0, 2),
            { name: 'Validating Connection', status: 'success' }
          ]
        }
      };
    });
  },

  disconnectSocialAccount: async (accountId) => {
    set((state) => ({
      socialAccounts: state.socialAccounts.filter(a => a.id !== accountId)
    }));
  },

  addNotification: (message, type) => {
    const id = `notif-${Date.now()}`;
    set((state) => ({
      notifications: [...state.notifications, { id, message, type }]
    }));
  },

  clearNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id)
  })),

  setActiveModule: (module) => set({ activeModule: module }),
  completeOnboarding: () => set({ isOnboarded: true }),
  setActiveBusinessId: (id) => set({ activeBusinessId: id }),
  setBusinessTemplate: (template) => set({ businessTemplate: template }),
  setActiveBusinessTab: (tab) => set({ activeBusinessTab: tab }),
  addTeamMember: (businessId, member) => set((state) => {
    const team = state.businessTeam[businessId] || [];
    return { businessTeam: { ...state.businessTeam, [businessId]: [...team, member] } };
  }),
  removeTeamMember: (businessId, memberId) => set((state) => {
    const team = state.businessTeam[businessId] || [];
    return { businessTeam: { ...state.businessTeam, [businessId]: team.filter(m => m.id !== memberId) } };
  }),
  addBusinessNotification: (notification) => set((state) => {
    const notifs = state.businessNotifications[notification.businessId] || [];
    const newNotif: BusinessNotification = {
      ...notification,
      id: `bnotif-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    return { businessNotifications: { ...state.businessNotifications, [notification.businessId]: [newNotif, ...notifs] } };
  }),
  clearActiveProvisioning: () => set({ activeProvisioning: null }),
  setLanguage: (lang) => {
    document.documentElement.lang = lang;
    set({ language: lang, t: translations[lang] });
  },
  setTheme: (theme) => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.style.setProperty('--bg-primary', '#f8fafc');
      root.style.setProperty('--bg-secondary', '#ffffff');
      root.style.setProperty('--color-text', '#0f172a');
      root.style.setProperty('--color-text-muted', '#64748b');
      root.style.setProperty('--color-border', 'rgba(0, 0, 0, 0.08)');
      root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.7)');
      root.style.setProperty('--glass-border', 'rgba(0, 0, 0, 0.06)');
    } else {
      root.style.setProperty('--bg-primary', '#090d16');
      root.style.setProperty('--bg-secondary', '#0f172a');
      root.style.setProperty('--color-text', '#f8fafc');
      root.style.setProperty('--color-text-muted', '#94a3b8');
      root.style.setProperty('--color-border', 'rgba(255, 255, 255, 0.08)');
      root.style.setProperty('--glass-bg', 'rgba(15, 23, 42, 0.65)');
      root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.06)');
    }
    set({ theme });
  },
  setBrandColor: (color) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', color);
    root.style.setProperty('--color-primary-hover', adjustColorBrightness(color, 20));
    root.style.setProperty('--glass-glow', `${color}26`);
    root.style.setProperty('--glow-primary', `${color}66`);
    set({ brandColor: color });
  }
}));

function adjustColorBrightness(hex: string, percent: number): string {
  let R = parseInt(hex.substring(1, 3), 16);
  let G = parseInt(hex.substring(3, 5), 16);
  let B = parseInt(hex.substring(5, 7), 16);

  R = Math.min(255, Math.max(0, R + percent));
  G = Math.min(255, Math.max(0, G + percent));
  B = Math.min(255, Math.max(0, B + percent));

  const rHex = R.toString(16).padStart(2, '0');
  const gHex = G.toString(16).padStart(2, '0');
  const bHex = B.toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
}
