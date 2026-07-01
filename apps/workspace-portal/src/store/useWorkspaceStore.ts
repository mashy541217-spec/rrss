import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { translations } from './translations';
import type { LocaleType, Translations } from './translations';

const API_BASE = 'http://localhost:3000';

const getAuthToken = (): string | null => localStorage.getItem('rrss_token');

const authFetch = (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getAuthToken();
  return fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
};

export interface Business {
  id: string;
  name: string;
  category: string;
  socialAccountsCount: number;
  logoUrl?: string;
  brandColor?: string;
  emailBrand?: any;
  settings: BusinessSettings;
  team: TeamMember[];
}

export type BusinessTab = 'dashboard' | 'channels' | 'campaigns' | 'media' | 'automation' | 'analytics' | 'ai' | 'reports' | 'team' | 'settings' | 'health' | 'notifications';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  status: 'Active' | 'Pending' | 'Suspended';
  avatar?: string;
  lastActivity?: string;
}

export interface BusinessSettings {
  language: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  timeFormat: string;
  address: string;
  fiscalId: string;
  notifications: boolean;
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

export interface DAMFolder {
  id: string;
  businessId: string;
  name: string;
  parentId: string | null;
  isSmartCollection?: boolean;
}

export interface DAMAsset {
  id: string;
  businessId: string;
  folderId: string | null;
  name: string;
  type: 'image' | 'video' | 'reel' | 'story' | 'document' | 'template' | 'ai_asset' | 'brand';
  url: string;
  size: number;
  metadata: {
    title?: string;
    description?: string;
    altText?: string;
    keywords?: string[];
    primaryColors?: string[];
    suggestedHashtags?: string[];
    suggestedCaption?: string[];
  };
  createdAt: string;
}

export interface PublicationEvent {
  id: string;
  businessId: string;
  campaignId: string | null;
  assetIds: string[];
  channels: string[]; // references to SocialAccountInfo.provider or id
  scheduledDate: string;
  status: 'Draft' | 'Pending' | 'Scheduled' | 'Publishing' | 'Published' | 'Failed' | 'Cancelled';
  authorId: string;
  aiSuggestions?: {
    bestHour?: string;
    missingHashtags?: string[];
    lowQualityWarning?: boolean;
    suggestedChannels?: string[];
  };
}

export interface Campaign {
  id: string;
  businessId: string;
  name: string;
  objective?: string;
  description?: string;
  color?: string;
  labels?: string[];
  assetIds?: string[];
  channels?: string[];
  status: 'Draft' | 'Scheduled' | 'Running' | 'Paused' | 'Completed' | 'Cancelled' | 'Archived';
  startDate?: string;
  endDate?: string;
  goals?: string;
}

export interface AutomationFlow {
  id: string;
  businessId: string;
  name: string;
  status: 'Draft' | 'Active' | 'Paused';
  nodes: any[];
  edges: any[];
  lastRun?: string;
  createdAt: string;
}

export interface AIMessage {
  id: string;
  businessId: string;
  role: 'user' | 'assistant';
  content: string;
  actionCard?: 'create_campaign' | 'create_automation' | 'schedule_post' | 'analytics_summary';
  timestamp: string;
}

export interface GeneratedReport {
  id: string;
  businessId: string;
  type: string;
  dateRange: string;
  channels: string[];
  metrics: string[];
  exportFormat: string;
  status: 'Ready' | 'Generating' | 'Failed';
  createdAt: string;
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
  activeModule: 'dashboard' | 'social' | 'businesses' | 'automation' | 'calendar' | 'media' | 'analytics' | 'assistant' | 'marketplace' | 'reports' | 'settings' | 'billing' | 'beta';
  organizationName: string;
  workspaceId: string;
  workspaceName: string;
  workspaceSlug: string;
  timezone: string;
  locale: string;
  businesses: Business[];
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
  businessNotifications: Record<string, BusinessNotification[]>;
  businessHealthScore: Record<string, number>;
  
  isAuthenticated: boolean;
  currentUser: { id: string; email: string; name?: string } | null;
  authMode: 'login' | 'signup';
  token: string | null;
  
  damFolders: DAMFolder[];
  damAssets: DAMAsset[];
  
  publications: PublicationEvent[];
  campaigns: Campaign[];
  automations: AutomationFlow[];
  aiMessages: AIMessage[];
  reports: GeneratedReport[];
  
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  setOrganizationName: (name: string) => void;
  createWorkspace: (data: { name: string; slug: string; timezone: string; locale: string }) => Promise<string>;
  addBusiness: (name: string, category: string) => Promise<void>;
  addNotification: (message: string, type: 'success' | 'info' | 'error') => void;
  clearNotification: (id: string) => void;
  setActiveModule: (module: 'dashboard' | 'social' | 'businesses' | 'automation' | 'calendar' | 'media' | 'analytics' | 'assistant' | 'marketplace' | 'reports' | 'settings' | 'billing' | 'beta') => void;
  completeOnboarding: () => void;
  clearActiveProvisioning: () => void;
  setLanguage: (lang: LocaleType) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setBrandColor: (color: string) => void;
  setActiveBusinessId: (id: string) => void;
  setBusinessTemplate: (template: string) => void;
  setActiveBusinessTab: (tab: BusinessTab) => void;
  updateBusiness: (id: string, data: { name?: string; logoUrl?: string; brandColor?: string; emailBrand?: any }) => Promise<void>;
  addBusinessNotification: (notification: Omit<BusinessNotification, 'id' | 'timestamp'>) => void;
  
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  verifyEmailCode: (code: string) => Promise<void>;
  logout: () => void;
  setAuthMode: (mode: 'login' | 'signup') => void;
  
  connectSocialAccount: (provider: string, name: string) => Promise<void>;
  disconnectSocialAccount: (accountId: string) => Promise<void>;

  uploadAsset: (asset: Omit<DAMAsset, 'id' | 'createdAt' | 'businessId'>) => Promise<void>;
  createFolder: (folder: Omit<DAMFolder, 'id' | 'businessId'>) => void;
  moveAsset: (assetId: string, folderId: string | null) => void;
  deleteAsset: (assetId: string) => void;

  createPublication: (pub: Omit<PublicationEvent, 'id' | 'businessId'>) => void;
  updatePublicationTime: (pubId: string, newDate: string) => void;
  deletePublication: (pubId: string) => void;
  duplicatePublication: (pubId: string) => void;

  createCampaign: (campaign: Omit<Campaign, 'id' | 'businessId' | 'status'> & { status?: Campaign['status'] }) => void;
  updateCampaignStatus: (campaignId: string, status: Campaign['status']) => void;

  createAutomation: (automation: Omit<AutomationFlow, 'id' | 'businessId' | 'createdAt'>) => void;
  updateAutomation: (automationId: string, updates: Partial<AutomationFlow>) => void;
  deleteAutomation: (automationId: string) => void;

  addAIMessage: (message: Omit<AIMessage, 'id' | 'businessId' | 'timestamp'>) => void;

  generateReport: (report: Omit<GeneratedReport, 'id' | 'businessId' | 'createdAt' | 'status'>) => void;
  deleteReport: (reportId: string) => void;

  updateBusinessSettings: (businessId: string, updates: Partial<BusinessSettings>) => void;
  updateBusinessBrand: (businessId: string, updates: { brandColor?: string; logo?: string; name?: string }) => void;
  inviteTeamMember: (businessId: string, member: Omit<TeamMember, 'id' | 'status'>) => void;
  updateTeamMemberRole: (businessId: string, memberId: string, role: 'Admin' | 'Editor' | 'Viewer') => void;
  updateTeamMemberStatus: (businessId: string, memberId: string, status: 'Active' | 'Pending' | 'Suspended') => void;
  removeTeamMember: (businessId: string, memberId: string) => void;
}

export const useWorkspaceStore = create<WorkspaceStoreState>()(
  persist(
    (set, get) => ({
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
  businessNotifications: {},
  businessHealthScore: {},
  
  isAuthenticated: false,
  currentUser: null,
  authMode: 'login',
  token: null,
  
  damFolders: [],
  damAssets: [],

  publications: [],
  campaigns: [],
  automations: [],
  aiMessages: [],
  reports: [],

  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 9) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
  setStep: (step) => set({ currentStep: step }),
  setOrganizationName: (name) => set({ organizationName: name }),
  
  createWorkspace: async (data) => {
    try {
      const { currentUser } = get();
      const response = await authFetch('/workspaces', {
        method: 'POST',
        body: JSON.stringify({
          name: data.name,
          slug: data.slug,
          timezone: data.timezone,
          locale: data.locale,
          ownerId: currentUser?.id ?? 'guest',
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
      const response = await authFetch(`/workspaces/${wsId}/businesses`, {
        method: 'POST',
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
            emailBrand: created.emailBrand || undefined,
            settings: {
              language: 'English',
              timezone: 'UTC',
              currency: 'USD',
              dateFormat: 'MM/DD/YYYY',
              timeFormat: '12h',
              address: '',
              fiscalId: '',
              notifications: true
            },
            team: [
              { id: `tm-${Date.now()}`, name: 'You', email: 'owner@workspace.com', role: 'Admin', status: 'Active' }
            ] as TeamMember[] as TeamMember[]
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
        businesses: [...state.businesses, { 
          id: tempId, name, category, socialAccountsCount: 0, logoUrl: undefined, brandColor: '#8b5cf6', emailBrand: {},
          settings: {
            language: 'English',
            timezone: 'UTC',
            currency: 'USD',
            dateFormat: 'MM/DD/YYYY',
            timeFormat: '12h',
            address: '',
            fiscalId: '',
            notifications: true
          },
          team: [
            { id: `tm-${Date.now()}`, name: 'You', email: 'owner@workspace.com', role: 'Admin', status: 'Active' }
          ]
        }],
        activeBusinessId: state.activeBusinessId || tempId
      }));
      get().addNotification(`Registered Business "${name}" locally.`, 'info');
    }
  },

  updateBusiness: async (id, data) => {
    try {
      const response = await authFetch(`/businesses/${id}`, {
        method: 'PUT',
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

  uploadAsset: async (assetData) => {
    const { activeBusinessId } = get();
    if (!activeBusinessId) return;

    // Simulate backend AI processing time
    await new Promise(resolve => setTimeout(resolve, 800));

    set(state => {
      const newAsset: DAMAsset = {
        ...assetData,
        id: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        businessId: activeBusinessId,
        createdAt: new Date().toISOString()
      };
      return { damAssets: [newAsset, ...state.damAssets] };
    });
  },

  createFolder: (folderData) => set(state => {
    const { activeBusinessId } = get();
    if (!activeBusinessId) return state;

    const newFolder: DAMFolder = {
      ...folderData,
      id: `folder-${Date.now()}`,
      businessId: activeBusinessId
    };
    return { damFolders: [...state.damFolders, newFolder] };
  }),

  moveAsset: (assetId, folderId) => set(state => ({
    damAssets: state.damAssets.map(a => a.id === assetId ? { ...a, folderId } : a)
  })),

  deleteAsset: (assetId) => set(state => ({
    damAssets: state.damAssets.filter(a => a.id !== assetId)
  })),

  createPublication: (pubData) => set(state => {
    const { activeBusinessId } = get();
    if (!activeBusinessId) return state;

    const newPub: PublicationEvent = {
      ...pubData,
      id: `pub-${Date.now()}`,
      businessId: activeBusinessId
    };
    return { publications: [...state.publications, newPub] };
  }),

  updatePublicationTime: (pubId, newDate) => set(state => ({
    publications: state.publications.map(p => p.id === pubId ? { ...p, scheduledDate: newDate } : p)
  })),

  deletePublication: (pubId) => set(state => ({
    publications: state.publications.filter(p => p.id !== pubId)
  })),

  duplicatePublication: (pubId) => set(state => {
    const pubToDup = state.publications.find(p => p.id === pubId);
    if (!pubToDup) return state;

    const newPub: PublicationEvent = {
      ...pubToDup,
      id: `pub-${Date.now()}`,
      status: 'Draft',
      scheduledDate: new Date(new Date(pubToDup.scheduledDate).getTime() + 24*60*60*1000).toISOString() // Next day
    };
    return { publications: [...state.publications, newPub] };
  }),

  createCampaign: (campaignData) => set(state => {
    const { activeBusinessId } = get();
    if (!activeBusinessId) return state;
    const newCamp: Campaign = {
      ...campaignData,
      id: `camp-${Date.now()}`,
      businessId: activeBusinessId,
      status: campaignData.status || 'Draft'
    };
    return { campaigns: [...state.campaigns, newCamp] };
  }),

  updateCampaignStatus: (campaignId, status) => set(state => ({
    campaigns: state.campaigns.map(c => c.id === campaignId ? { ...c, status } : c)
  })),

  createAutomation: (data) => set(state => {
    const { activeBusinessId } = get();
    if (!activeBusinessId) return state;
    const newAuto: AutomationFlow = {
      ...data,
      id: `auto-${Date.now()}`,
      businessId: activeBusinessId,
      createdAt: new Date().toISOString()
    };
    return { automations: [...state.automations, newAuto] };
  }),

  updateAutomation: (id, updates) => set(state => ({
    automations: state.automations.map(a => a.id === id ? { ...a, ...updates } : a)
  })),

  deleteAutomation: (id) => set(state => ({
    automations: state.automations.filter(a => a.id !== id)
  })),

  addAIMessage: (msgData) => set(state => {
    const { activeBusinessId } = get();
    if (!activeBusinessId) return state;
    const newMessage: AIMessage = {
      ...msgData,
      id: `ai-${Date.now()}`,
      businessId: activeBusinessId,
      timestamp: new Date().toISOString()
    };
    return { aiMessages: [...state.aiMessages, newMessage] };
  }),

  generateReport: (data) => set(state => {
    const { activeBusinessId } = get();
    if (!activeBusinessId) return state;
    const newReport: GeneratedReport = {
      ...data,
      id: `rep-${Date.now()}`,
      businessId: activeBusinessId,
      status: 'Ready',
      createdAt: new Date().toISOString()
    };
    return { reports: [newReport, ...state.reports] };
  }),

  deleteReport: (id) => set(state => ({
    reports: state.reports.filter(r => r.id !== id)
  })),

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

  updateBusinessSettings: (businessId, updates) => set(state => ({
    businesses: state.businesses.map(b => 
      b.id === businessId 
        ? { ...b, settings: { ...b.settings, ...updates } }
        : b
    )
  })),

  updateBusinessBrand: (businessId, updates) => set(state => ({
    businesses: state.businesses.map(b =>
      b.id === businessId ? { ...b, ...updates } : b
    )
  })),

  inviteTeamMember: (businessId, member) => set(state => ({
    businesses: state.businesses.map(b =>
      b.id === businessId 
        ? { ...b, team: [...b.team, { ...member, id: `tm-${Date.now()}`, status: 'Pending' }] }
        : b
    )
  })),

  updateTeamMemberRole: (businessId, memberId, role) => set(state => ({
    businesses: state.businesses.map(b =>
      b.id === businessId 
        ? { ...b, team: b.team.map(m => m.id === memberId ? { ...m, role } : m) }
        : b
    )
  })),

  updateTeamMemberStatus: (businessId, memberId, status) => set(state => ({
    businesses: state.businesses.map(b =>
      b.id === businessId 
        ? { ...b, team: b.team.map(m => m.id === memberId ? { ...m, status } : m) }
        : b
    )
  })),

  removeTeamMember: (businessId, memberId) => set(state => ({
    businesses: state.businesses.map(b =>
      b.id === businessId 
        ? { ...b, team: b.team.filter(m => m.id !== memberId) }
        : b
    )
  })),

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
  },

  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message ?? 'Invalid email or password');
    }
    const data = await res.json();
    localStorage.setItem('rrss_token', data.token);
    set({
      isAuthenticated: true,
      isOnboarded: true,
      token: data.token,
      currentUser: { id: data.userId, email: data.email, name: data.displayName },
    });
    get().addNotification(`Welcome back, ${data.displayName}!`, 'success');
  },

  signup: async (email, password) => {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, displayName: email.split('@')[0], password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message ?? 'Registration failed');
    }
    const data = await res.json();
    // Alpha: store userId for verification step, show code in the UI
    set({
      currentUser: { id: data.userId, email, name: email.split('@')[0] },
      authMode: 'login',
      currentStep: 2,
    });
    get().addNotification(
      `Account created! Your verification code is: ${data.verificationCode}`,
      'info',
    );
  },

  verifyEmailCode: async (code) => {
    const { currentUser } = get();
    if (!currentUser?.id) throw new Error('No pending user to verify');
    const res = await fetch(`${API_BASE}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id, code }),
    });
    if (!res.ok) {
      get().addNotification('Invalid verification code. Check the notification above.', 'error');
      throw new Error('Invalid code');
    }
    set({ isAuthenticated: true, isOnboarded: false, currentStep: 3 });
    get().addNotification('Email verified! Let\'s set up your workspace.', 'success');
  },

  logout: () => {
    localStorage.removeItem('rrss_token');
    set({
      isAuthenticated: false,
      currentUser: null,
      token: null,
      isOnboarded: false,
      currentStep: 1,
    });
    get().addNotification('Logged out successfully', 'info');
  },

  setAuthMode: (mode) => set({ authMode: mode })
    }),
    {
      name: 'rrss-workspace-store',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        isOnboarded: state.isOnboarded,
        currentUser: state.currentUser,
        token: state.token,
        workspaceId: state.workspaceId,
        workspaceName: state.workspaceName,
        workspaceSlug: state.workspaceSlug,
        organizationName: state.organizationName,
        businesses: state.businesses,
        activeBusinessId: state.activeBusinessId,
        socialAccounts: state.socialAccounts,
        language: state.language,
        theme: state.theme,
        brandColor: state.brandColor,
      }),
    },
  ),
);

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
