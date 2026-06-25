import type { AITokenMetrics } from './AITokenMetrics';
import type { AIChatMessage } from './AIChatMessage';

export interface AICompletionResponse {
  id: string;
  provider: string;
  model: string;
  message: AIChatMessage;
  metrics: AITokenMetrics;
  finishReason: 'stop' | 'length' | 'tool_calls' | 'content_filter' | 'error';
  latencyMs: number;
  toolCalls?: {
    id: string;
    name: string;
    arguments: string;
  }[];
}
