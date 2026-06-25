import type { IAIChatProvider, AIChatOptions } from './IAIChatProvider';
import type { AIChatMessage } from '../models/AIChatMessage';
import type { AICompletionResponse } from '../models/AICompletionResponse';
import type { AIToolDefinition } from '../models/AIToolDefinition';

export interface IAIToolCallingProvider extends IAIChatProvider {
  chatWithTools(
    messages: AIChatMessage[], 
    tools: AIToolDefinition[], 
    options?: AIChatOptions
  ): Promise<AICompletionResponse>;
}
