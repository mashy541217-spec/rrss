export interface AIProviderConfig {
  apiKey: string;
  model: string;
  baseUrl?: string;
  timeoutMs?: number;
  maxRetries?: number;
}

export interface IAIProvider {
  getProviderName(): string;
  getDefaultModel(): string;
}
