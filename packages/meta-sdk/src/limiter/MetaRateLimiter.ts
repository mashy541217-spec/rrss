export class MetaRateLimiter {
  private lastRequestTime = 0;
  private isAvailable = true;
  private remainingRequests = 1000;
  private maxLimit = 1000;
  private resetTime = Date.now();

  public async executeWithRetry<T>(
    fn: () => Promise<T>,
    retries = 3,
    delay = 100
  ): Promise<T> {
    if (!this.isAvailable && Date.now() < this.resetTime) {
      throw new Error('Graph API is temporarily unavailable (rate limited).');
    }

    try {
      const result = await fn();
      // Track request usage
      this.remainingRequests = Math.max(0, this.remainingRequests - 1);
      this.lastRequestTime = Date.now();
      return result;
    } catch (error: any) {
      // Handle rate limit error code 429
      const isRateLimitError = error.message?.includes('rate limit') || error.message?.includes('429');
      
      if (isRateLimitError && retries > 0) {
        this.isAvailable = false;
        this.resetTime = Date.now() + delay; // Set wait window
        
        // Wait and retry
        await new Promise(resolve => setTimeout(resolve, delay));
        this.isAvailable = true;
        return this.executeWithRetry(fn, retries - 1, delay * 2);
      }
      throw error;
    }
  }

  public getRateLimitStatus() {
    return {
      limit: this.maxLimit,
      remaining: this.remainingRequests,
      resetTime: new Date(this.resetTime)
    };
  }

  public updateLimit(limit: number, remaining: number, resetTimeMs: number) {
    this.maxLimit = limit;
    this.remainingRequests = remaining;
    this.resetTime = resetTimeMs;
    this.isAvailable = remaining > 0;
  }
}
