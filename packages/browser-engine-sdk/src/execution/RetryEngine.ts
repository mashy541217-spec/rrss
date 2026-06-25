export class RetryEngine {
  public static async executeWithRetry<T>(operation: () => Promise<T>, maxRetries = 3, initialDelayMs = 1000): Promise<T> {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        return await operation();
      } catch (err: any) {
        attempt++;
        if (attempt >= maxRetries) {
          throw new Error(`Operation failed after ${maxRetries} attempts: ${err.message}`);
        }
        const delay = initialDelayMs * Math.pow(2, attempt - 1); // Exponential backoff
        await new Promise(res => setTimeout(res, delay));
      }
    }
    throw new Error('Unreachable code in RetryEngine');
  }
}
