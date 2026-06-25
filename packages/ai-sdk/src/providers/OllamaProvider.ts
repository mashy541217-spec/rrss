import type { IAIChatProvider, AIChatOptions } from '../core/IAIChatProvider';
import type { AIProviderConfig } from '../core/IAIProvider';
import type { AIChatMessage } from '../models/AIChatMessage';
import type { AICompletionResponse } from '../models/AICompletionResponse';
import type { AIStreamChunk } from '../models/AIStreamChunk';

export class OllamaProvider implements IAIChatProvider {
  private config: AIProviderConfig;
  private baseUrl: string;

  constructor(config: AIProviderConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'http://localhost:11434/api';
  }

  getProviderName(): string {
    return 'Ollama';
  }

  getDefaultModel(): string {
    return 'llama3';
  }

  async chat(messages: AIChatMessage[], options?: AIChatOptions): Promise<AICompletionResponse> {
    const response = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        stream: false,
        options: {
          temperature: options?.temperature,
          num_predict: options?.maxTokens,
          stop: options?.stopSequences
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API Error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      id: `ollama-${Date.now()}`,
      provider: this.getProviderName(),
      model: data.model,
      message: {
        role: 'assistant',
        content: data.message?.content || ''
      },
      metrics: {
        inputTokens: data.prompt_eval_count || 0,
        outputTokens: data.eval_count || 0,
        totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0)
      },
      finishReason: 'stop',
      latencyMs: Math.round(data.total_duration / 1000000) // Convert ns to ms
    };
  }

  async *chatStream(_messages: AIChatMessage[], _options?: AIChatOptions): AsyncGenerator<AIStreamChunk, void, unknown> {
    throw new Error('Streaming not implemented for Ollama provider yet.');
  }
}
