import type { IAIProvider } from './IAIProvider';
import type { AIChatMessage } from '../models/AIChatMessage';
import type { AICompletionResponse } from '../models/AICompletionResponse';
import type { AIStreamChunk } from '../models/AIStreamChunk';

export interface AIChatOptions {
  temperature?: number;
  maxTokens?: number;
  stopSequences?: string[];
}

export interface IAIChatProvider extends IAIProvider {
  chat(messages: AIChatMessage[], options?: AIChatOptions): Promise<AICompletionResponse>;
  chatStream(messages: AIChatMessage[], options?: AIChatOptions): AsyncGenerator<AIStreamChunk, void, unknown>;
}
