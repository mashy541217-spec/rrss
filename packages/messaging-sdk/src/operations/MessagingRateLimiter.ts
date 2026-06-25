export interface MessagingRateLimit {
  remaining: number;
  resetAt: Date;
  limit: number;
}

export class MessagingRateLimiter {
  constructor(
    private readonly limits: { calls: number; windowMs: number } = { calls: 30, windowMs: 1000 }
  ) {}

  public async executeWithRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        return await operation();
      } catch (error: any) {
        attempt++;
        if (attempt >= maxRetries) throw error;
        // Simple backoff if rate limited
        if (error.message?.includes('429') || error.message?.includes('Too Many Requests')) {
          const backoff = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, backoff));
        } else {
          throw error;
        }
      }
    }
    throw new Error('Max retries exceeded');
  }

  public getRateLimitStatus(): MessagingRateLimit {
    return {
      remaining: this.limits.calls,
      resetAt: new Date(Date.now() + this.limits.windowMs),
      limit: this.limits.calls
    };
  }
}
