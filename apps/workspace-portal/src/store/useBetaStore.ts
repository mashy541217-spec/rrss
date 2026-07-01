import { create } from 'zustand';

// 1. Beta Invitations
export interface BetaInvitation {
  id: string;
  email: string;
  status: 'Sent' | 'Accepted' | 'Expired' | 'Revoked';
  sentAt: string;
  notes: string;
}

// 2. Feature Flags
export interface FeatureFlag {
  id: string;
  key: string;
  description: string;
  state: 'Enabled' | 'Disabled';
  rolloutStrategy: 'Percentage' | 'Workspace' | 'Organization' | 'Tester' | 'Internal' | 'Beta' | 'RC';
  rolloutValue: number | string; // e.g. 50 (for 50%), or 'WorkspaceID'
}

// 3. Feedback Center
export interface BetaFeedback {
  id: string;
  userId: string;
  type: 'Bug Report' | 'Feature Request' | 'Improvement' | 'General';
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  content: string;
  rating: number; // 1-5
  status: 'Open' | 'Reviewed' | 'Resolved';
  createdAt: string;
}

// 4. Crash Reports (Architecture)
export interface CrashReport {
  id: string;
  userId: string;
  errorMessage: string;
  stackTrace: string;
  browser: string;
  os: string;
  workspaceVersion: string;
  timestamp: string;
}

// 5. Product Telemetry (Architecture)
export interface TelemetryEvent {
  id: string;
  userId: string;
  sessionId: string;
  eventType: 'Navigation' | 'Click' | 'Onboarding' | 'FeatureUsage';
  eventData: any;
  timestamp: string;
}

// 6. Release Channels & Changelog
export type ReleaseChannel = 'Development' | 'Internal' | 'Private Beta' | 'Release Candidate' | 'General Availability';

export interface ReleaseNote {
  id: string;
  version: string;
  channel: ReleaseChannel;
  title: string;
  description: string;
  features: string[];
  fixes: string[];
  releasedAt: string;
}

export interface BetaStoreState {
  activeTab: 'dashboard' | 'invitations' | 'featureFlags' | 'feedback' | 'changelog' | 'health';
  
  invitations: BetaInvitation[];
  featureFlags: FeatureFlag[];
  feedbacks: BetaFeedback[];
  crashReports: CrashReport[];
  releaseNotes: ReleaseNote[];
  telemetry: TelemetryEvent[]; // architectural

  setActiveTab: (tab: BetaStoreState['activeTab']) => void;
  inviteTester: (email: string, notes: string) => void;
  revokeInvitation: (id: string) => void;
  toggleFeatureFlag: (id: string, state: 'Enabled' | 'Disabled') => void;
  submitFeedback: (feedback: Omit<BetaFeedback, 'id' | 'createdAt' | 'status'>) => void;
}

export const useBetaStore = create<BetaStoreState>((set) => ({
  activeTab: 'dashboard',

  invitations: [
    { id: 'i1', email: 'tester1@example.com', status: 'Accepted', sentAt: new Date().toISOString(), notes: 'VIP Client' },
    { id: 'i2', email: 'tester2@example.com', status: 'Sent', sentAt: new Date().toISOString(), notes: 'Early Adopter' }
  ],
  
  featureFlags: [
    { id: 'ff1', key: 'new_automation_ui', description: 'Enable the visual node editor for automations', state: 'Enabled', rolloutStrategy: 'Percentage', rolloutValue: 50 },
    { id: 'ff2', key: 'ai_copilot_v2', description: 'Next generation AI copilot with deeper context', state: 'Disabled', rolloutStrategy: 'Beta', rolloutValue: '' },
    { id: 'ff3', key: 'enterprise_sso', description: 'SAML/SSO for Enterprise accounts', state: 'Enabled', rolloutStrategy: 'Internal', rolloutValue: '' }
  ],

  feedbacks: [
    { id: 'fb1', userId: 'u1', type: 'Bug Report', category: 'Calendar', priority: 'High', content: 'Drag and drop fails on Safari 16.', rating: 3, status: 'Open', createdAt: new Date().toISOString() },
    { id: 'fb2', userId: 'u2', type: 'Feature Request', category: 'Analytics', priority: 'Medium', content: 'Would love to see TikTok audience demographics.', rating: 5, status: 'Reviewed', createdAt: new Date().toISOString() }
  ],

  crashReports: [
    { id: 'cr1', userId: 'u3', errorMessage: 'TypeError: Cannot read properties of undefined (reading "brandColor")', stackTrace: 'at BusinessCard.tsx:42\nat renderWithHooks', browser: 'Chrome 124', os: 'Windows 11', workspaceVersion: '0.14.3', timestamp: new Date().toISOString() }
  ],

  telemetry: [],

  releaseNotes: [
    { 
      id: 'rn1', version: '0.14.3', channel: 'Private Beta', title: 'Customer Account Center', 
      description: 'Massive update bringing centralized organization management to the platform.',
      features: ['Organization Profile', 'Workspace Manager', 'Global Team Manager', 'Security Settings'],
      fixes: ['Fixed race condition in OAuth flow', 'Improved dashboard rendering speed'],
      releasedAt: new Date().toISOString()
    }
  ],

  setActiveTab: (tab) => set({ activeTab: tab }),

  inviteTester: (email, notes) => set((state) => ({
    invitations: [...state.invitations, {
      id: Math.random().toString(36).substring(7),
      email,
      status: 'Sent',
      sentAt: new Date().toISOString(),
      notes
    }]
  })),

  revokeInvitation: (id) => set((state) => ({
    invitations: state.invitations.map(inv => inv.id === id ? { ...inv, status: 'Revoked' } : inv)
  })),

  toggleFeatureFlag: (id, flagState) => set((state) => ({
    featureFlags: state.featureFlags.map(ff => ff.id === id ? { ...ff, state: flagState } : ff)
  })),

  submitFeedback: (feedback) => set((state) => ({
    feedbacks: [...state.feedbacks, {
      ...feedback,
      id: Math.random().toString(36).substring(7),
      status: 'Open',
      createdAt: new Date().toISOString()
    }]
  }))
}));
