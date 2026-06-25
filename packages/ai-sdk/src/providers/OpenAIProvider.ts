import type { IAIToolCallingProvider } from '../core/IAIToolCallingProvider';
import type { AIProviderConfig } from '../core/IAIProvider';
import type { AIChatMessage } from '../models/AIChatMessage';
import type { AICompletionResponse } from '../models/AICompletionResponse';
import type { AIChatOptions } from '../core/IAIChatProvider';
import type { AIToolDefinition } from '../models/AIToolDefinition';
import type { AIStreamChunk } from '../models/AIStreamChunk';

export class OpenAIProvider implements IAIToolCallingProvider {
  private config: AIProviderConfig;
  private baseUrl: string;

  constructor(config: AIProviderConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://api.openai.com/v1';
  }

  getProviderName(): string {
    return 'OpenAI';
  }

  getDefaultModel(): string {
    return 'gpt-4o';
  }

  async chat(messages: AIChatMessage[], options?: AIChatOptions): Promise<AICompletionResponse> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model,
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens,
        stop: options?.stopSequences
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      id: data.id,
      provider: this.getProviderName(),
      model: data.model,
      message: {
        role: 'assistant',
        content: data.choices[0].message.content || ''
      },
      metrics: {
        inputTokens: data.usage.prompt_tokens,
        outputTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens
      },
      finishReason: data.choices[0].finish_reason,
      latencyMs: 0 // Would be calculated in a real wrapper
    };
  }

  async chatWithTools(messages: AIChatMessage[], tools: AIToolDefinition[], options?: AIChatOptions): Promise<AICompletionResponse> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model,
        messages,
        tools,
        tool_choice: 'auto',
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const message = data.choices[0].message;

    return {
      id: data.id,
      provider: this.getProviderName(),
      model: data.model,
      message: {
        role: 'assistant',
        content: message.content || ''
      },
      metrics: {
        inputTokens: data.usage.prompt_tokens,
        outputTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens
      },
      finishReason: data.choices[0].finish_reason,
      latencyMs: 0,
      toolCalls: message.tool_calls?.map((tc: any) => ({
        id: tc.id,
        name: tc.function.name,
        arguments: tc.function.arguments
      }))
    };
  }

  async *chatStream(messages: AIChatMessage[], options?: AIChatOptions): AsyncGenerator<AIStreamChunk, void, unknown> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model,
        messages,
        temperature: options?.temperature ?? 0.7,
        stream: true
      })
    });

    if (!response.ok || !response.body) {
      throw new Error(`OpenAI API Stream Error`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim().startsWith('data: '));

      for (const line of lines) {
        const dataStr = line.replace(/^data: /, '').trim();
        if (dataStr === '[DONE]') {
          yield { id: '', provider: this.getProviderName(), model: this.config.model, delta: '', isFinished: true };
          return;
        }

        try {
          const data = JSON.parse(dataStr);
          yield {
            id: data.id,
            provider: this.getProviderName(),
            model: data.model,
            delta: data.choices[0]?.delta?.content || '',
            isFinished: data.choices[0]?.finish_reason !== null
          };
        } catch (e) {
          // Ignore parse errors on partial chunks
        }
      }
    }
  }
}
