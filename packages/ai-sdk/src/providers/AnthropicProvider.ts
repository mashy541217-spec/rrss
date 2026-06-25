import type { IAIChatProvider, AIChatOptions } from '../core/IAIChatProvider';
import type { AIProviderConfig } from '../core/IAIProvider';
import type { AIChatMessage } from '../models/AIChatMessage';
import type { AICompletionResponse } from '../models/AICompletionResponse';
import type { AIStreamChunk } from '../models/AIStreamChunk';

export class AnthropicProvider implements IAIChatProvider {
  private config: AIProviderConfig;
  private baseUrl: string;

  constructor(config: AIProviderConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://api.anthropic.com/v1';
  }

  getProviderName(): string {
    return 'Anthropic';
  }

  getDefaultModel(): string {
    return 'claude-3-5-sonnet-20240620';
  }

  private mapMessages(messages: AIChatMessage[]) {
    // Anthropic requires a top-level system parameter, and then user/assistant turns
    let system = '';
    const mapped = messages.filter(m => {
      if (m.role === 'system') {
        system += m.content + '\n';
        return false;
      }
      return true;
    }).map(m => ({
      role: m.role,
      content: m.content
    }));

    return { system: system.trim(), messages: mapped };
  }

  async chat(messages: AIChatMessage[], options?: AIChatOptions): Promise<AICompletionResponse> {
    const { system, messages: mappedMessages } = this.mapMessages(messages);

    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.config.model,
        system: system || undefined,
        messages: mappedMessages,
        max_tokens: options?.maxTokens || 4096,
        temperature: options?.temperature ?? 0.7,
        stop_sequences: options?.stopSequences
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      id: data.id,
      provider: this.getProviderName(),
      model: data.model,
      message: {
        role: 'assistant',
        content: data.content[0]?.text || ''
      },
      metrics: {
        inputTokens: data.usage.input_tokens,
        outputTokens: data.usage.output_tokens,
        totalTokens: data.usage.input_tokens + data.usage.output_tokens
      },
      finishReason: data.stop_reason === 'end_turn' ? 'stop' : (data.stop_reason === 'max_tokens' ? 'length' : 'stop'),
      latencyMs: 0
    };
  }

  async *chatStream(_messages: AIChatMessage[], _options?: AIChatOptions): AsyncGenerator<AIStreamChunk, void, unknown> {
    throw new Error('Streaming not implemented for Anthropic provider yet.');
  }
}
