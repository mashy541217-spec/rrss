import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  workflowTemplate?: { nodes: any[]; edges: any[] };
}

export interface AIAssistantState {
  isOpen: boolean;
  isTyping: boolean;
  messages: ChatMessage[];
  activeAgent: 'architect' | 'reviewer' | 'optimizer';
  
  togglePanel: () => void;
  setTyping: (typing: boolean) => void;
  addMessage: (msg: Omit<ChatMessage, 'id'>) => void;
  setActiveAgent: (agent: 'architect' | 'reviewer' | 'optimizer') => void;
  clearChat: () => void;
}

export const useAIAssistantStore = create<AIAssistantState>((set) => ({
  isOpen: false,
  isTyping: false,
  activeAgent: 'architect',
  messages: [
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I am your AI Automation Architect. What kind of workflow would you like to build today?'
    }
  ],

  togglePanel: () => set((state) => ({ isOpen: !state.isOpen })),
  setTyping: (typing) => set({ isTyping: typing }),
  setActiveAgent: (agent) => set({ activeAgent: agent }),
  clearChat: () => set({ messages: [] }),
  
  addMessage: (msg) => set((state) => ({
    messages: [...state.messages, { ...msg, id: Date.now().toString() }]
  }))
}));
