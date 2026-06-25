export type AIRole = 'system' | 'user' | 'assistant' | 'tool';

export interface AIChatMessage {
  role: AIRole;
  content: string;
  name?: string;
  toolCallId?: string;
}
