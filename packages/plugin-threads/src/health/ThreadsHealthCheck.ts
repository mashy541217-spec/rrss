import { MetaGraphApiClient } from '@rrss-auto/meta-sdk';

export interface ThreadsHealth {
  readonly isHealthy: boolean;
  readonly status: 'ACTIVE' | 'EXPIRED' | 'UNAUTHORIZED' | 'RATE_LIMITED';
  readonly details?: Record<string, any>;
}

export class ThreadsHealthCheck {
  public static async verify(client: MetaGraphApiClient): Promise<ThreadsHealth> {
    try {
      const isValid = await client.auth.validateToken();
      if (!isValid) {
        return {
          isHealthy: false,
          status: 'UNAUTHORIZED',
          details: { error: 'Invalid or expired access token' }
        };
      }
      return {
        isHealthy: true,
        status: 'ACTIVE',
        details: { timestamp: new Date() }
      };
    } catch (error: any) {
      const isRateLimited = error.message?.includes('429') || error.message?.includes('rate limit');
      return {
        isHealthy: false,
        status: isRateLimited ? 'RATE_LIMITED' : 'EXPIRED',
        details: { error: error.message }
      };
    }
  }
}
