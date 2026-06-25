import type { IAIChatProvider, AIChatOptions } from '../core/IAIChatProvider';
import type { AIChatMessage } from '../models/AIChatMessage';
import type { AICompletionResponse } from '../models/AICompletionResponse';
import type { AIStreamChunk } from '../models/AIStreamChunk';

export class FailoverRouter implements IAIChatProvider {
  private providers: IAIChatProvider[];

  constructor(providers: IAIChatProvider[]) {
    if (providers.length === 0) {
      throw new Error('FailoverRouter requires at least one provider');
    }
    this.providers = providers;
  }

  getProviderName(): string {
    return `FailoverRouter(${this.providers.map(p => p.getProviderName()).join(',')})`;
  }

  getDefaultModel(): string {
    return this.providers[0].getDefaultModel();
  }

  async chat(messages: AIChatMessage[], options?: AIChatOptions): Promise<AICompletionResponse> {
    let lastError: Error | null = null;

    for (const provider of this.providers) {
      try {
        const response = await provider.chat(messages, options);
        return response;
      } catch (error: any) {
        console.warn(`[FailoverRouter] Provider ${provider.getProviderName()} failed: ${error.message}`);
        lastError = error;
        // Continue to next provider
      }
    }

    throw new Error(`All providers in FailoverRouter failed. Last error: ${lastError?.message}`);
  }

  async *chatStream(messages: AIChatMessage[], options?: AIChatOptions): AsyncGenerator<AIStreamChunk, void, unknown> {
    // Basic streaming fallback (note: cannot resume mid-stream if a provider fails halfway)
    let lastError: Error | null = null;

    for (const provider of this.providers) {
      try {
        const stream = provider.chatStream(messages, options);
        for await (const chunk of stream) {
          yield chunk;
        }
        return; // Success, exit
      } catch (error: any) {
        console.warn(`[FailoverRouter] Stream Provider ${provider.getProviderName()} failed: ${error.message}`);
        lastError = error;
        // Continue to next
      }
    }

    throw new Error(`All streaming providers in FailoverRouter failed. Last error: ${lastError?.message}`);
  }
}
