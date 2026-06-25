import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface CredentialVaultItem {
  id: string;
  name: string;
  provider: string; // e.g. 'Telegram', 'Instagram', 'DealerNet'
  type: 'oauth' | 'token' | 'basic';
  workspaceId: string;
  status: 'active' | 'expired' | 'revoked';
  expiresAt?: string;
  lastRotatedAt: string;
}

export interface CredentialState {
  credentials: CredentialVaultItem[];
  
  addCredential: (cred: Omit<CredentialVaultItem, 'id' | 'status' | 'lastRotatedAt'>) => void;
  revokeCredential: (id: string) => void;
  rotateCredential: (id: string) => void;
}

export const useCredentialStore = create<CredentialState>((set) => ({
  credentials: [
    {
      id: 'cred-1',
      name: 'Prod Telegram Bot',
      provider: 'Telegram',
      type: 'token',
      workspaceId: 'ws-default',
      status: 'active',
      lastRotatedAt: new Date().toISOString()
    },
    {
      id: 'cred-2',
      name: 'DealerNet QA Account',
      provider: 'DealerNet',
      type: 'basic',
      workspaceId: 'ws-qa',
      status: 'expired',
      expiresAt: new Date(Date.now() - 86400000).toISOString(),
      lastRotatedAt: new Date(Date.now() - 30 * 86400000).toISOString()
    }
  ],

  addCredential: (cred) => set((state) => ({
    credentials: [...state.credentials, {
      ...cred,
      id: uuidv4(),
      status: 'active',
      lastRotatedAt: new Date().toISOString()
    }]
  })),

  revokeCredential: (id) => set((state) => ({
    credentials: state.credentials.map(c => 
      c.id === id ? { ...c, status: 'revoked' } : c
    )
  })),

  rotateCredential: (id) => set((state) => ({
    credentials: state.credentials.map(c => 
      c.id === id ? { ...c, status: 'active', lastRotatedAt: new Date().toISOString() } : c
    )
  }))
}));
