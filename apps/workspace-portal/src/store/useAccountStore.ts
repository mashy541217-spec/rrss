import { create } from 'zustand';

export interface OrganizationProfile {
  name: string;
  logo: string | null;
  brandColor: string;
  language: string;
  timezone: string;
  currency: string;
  country: string;
  address: string;
  website: string;
  email: string;
  phone: string;
}

export interface WorkspaceSummary {
  id: string;
  name: string;
  status: 'active' | 'archived';
  memberCount: number;
  businessCount: number;
  createdAt: string;
}

export interface AccountTeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Member';
  status: 'Active' | 'Suspended' | 'Pending';
  avatar: string | null;
  lastActive: string;
}

// Beta Testing Preparation Models (Architecture Only)
export interface BetaInvitation {
  id: string;
  email: string;
  status: 'Sent' | 'Accepted' | 'Expired';
  sentAt: string;
}

export interface FeedbackReport {
  id: string;
  userId: string;
  type: 'Bug' | 'FeatureRequest' | 'General';
  content: string;
  attachments: string[];
  status: 'Open' | 'Reviewed' | 'Resolved';
}

export interface CrashReport {
  id: string;
  userId: string;
  errorMessage: string;
  stackTrace: string;
  timestamp: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  accessibilityHighContrast: boolean;
  accessibilityReduceMotion: boolean;
}

export interface AccountStoreState {
  profile: OrganizationProfile;
  workspaces: WorkspaceSummary[];
  team: AccountTeamMember[];
  preferences: UserPreferences;
  activeAccountTab: 'organization' | 'workspaces' | 'businesses' | 'team' | 'security' | 'preferences' | 'billing';

  // Actions
  updateProfile: (updates: Partial<OrganizationProfile>) => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  setActiveAccountTab: (tab: AccountStoreState['activeAccountTab']) => void;
  createWorkspace: (name: string) => void;
  renameWorkspace: (id: string, name: string) => void;
  archiveWorkspace: (id: string) => void;
  duplicateWorkspace: (id: string) => void;
  inviteMember: (email: string, role: AccountTeamMember['role']) => void;
  suspendMember: (id: string) => void;
  removeMember: (id: string) => void;
  updateMemberRole: (id: string, role: AccountTeamMember['role']) => void;
}

export const useAccountStore = create<AccountStoreState>((set) => ({
  activeAccountTab: 'organization',
  profile: {
    name: 'My Organization',
    logo: null,
    brandColor: '#8b5cf6',
    language: 'English',
    timezone: 'America/New_York',
    currency: 'USD',
    country: 'United States',
    address: '123 Business St',
    website: 'https://example.com',
    email: 'admin@example.com',
    phone: '+1 (555) 123-4567'
  },
  workspaces: [
    { id: 'w1', name: 'Primary Workspace', status: 'active', memberCount: 3, businessCount: 2, createdAt: new Date().toISOString() }
  ],
  team: [
    { id: 'u1', name: 'Admin User', email: 'admin@example.com', role: 'Owner', status: 'Active', avatar: null, lastActive: new Date().toISOString() }
  ],
  preferences: {
    theme: 'dark',
    language: 'en',
    emailNotifications: true,
    pushNotifications: true,
    accessibilityHighContrast: false,
    accessibilityReduceMotion: false,
  },

  updateProfile: (updates) => set((state) => ({ profile: { ...state.profile, ...updates } })),
  updatePreferences: (updates) => set((state) => ({ preferences: { ...state.preferences, ...updates } })),
  setActiveAccountTab: (tab) => set({ activeAccountTab: tab }),

  createWorkspace: (name) => set((state) => ({
    workspaces: [...state.workspaces, {
      id: Math.random().toString(36).substr(2, 9),
      name,
      status: 'active',
      memberCount: 1,
      businessCount: 0,
      createdAt: new Date().toISOString()
    }]
  })),
  renameWorkspace: (id, name) => set((state) => ({
    workspaces: state.workspaces.map(w => w.id === id ? { ...w, name } : w)
  })),
  archiveWorkspace: (id) => set((state) => ({
    workspaces: state.workspaces.map(w => w.id === id ? { ...w, status: 'archived' } : w)
  })),
  duplicateWorkspace: (id) => set((state) => {
    const ws = state.workspaces.find(w => w.id === id);
    if (!ws) return state;
    return {
      workspaces: [...state.workspaces, {
        ...ws,
        id: Math.random().toString(36).substr(2, 9),
        name: `${ws.name} (Copy)`,
        createdAt: new Date().toISOString()
      }]
    };
  }),

  inviteMember: (email, role) => set((state) => ({
    team: [...state.team, {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role,
      status: 'Pending',
      avatar: null,
      lastActive: new Date().toISOString()
    }]
  })),
  suspendMember: (id) => set((state) => ({
    team: state.team.map(m => m.id === id ? { ...m, status: 'Suspended' } : m)
  })),
  removeMember: (id) => set((state) => ({
    team: state.team.filter(m => m.id !== id)
  })),
  updateMemberRole: (id, role) => set((state) => ({
    team: state.team.map(m => m.id === id ? { ...m, role } : m)
  }))
}));
