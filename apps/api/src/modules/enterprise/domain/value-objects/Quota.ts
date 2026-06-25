export class Quota {
  constructor(
    public readonly maxWorkspaces: number,
    public readonly maxExecutionsPerMonth: number,
    public readonly maxConcurrentJobs: number,
    public readonly maxStorageMb: number,
    public readonly maxAiTokens: number,
    public readonly maxSeats: number
  ) {}

  static forTier(tier: import('./Subscription').SubscriptionTier): Quota {
    switch (tier) {
      case 'FREE':
        return new Quota(1, 100, 1, 500, 10000, 1);
      case 'STARTER':
        return new Quota(3, 5000, 5, 5000, 1000000, 5);
      case 'PROFESSIONAL':
        return new Quota(10, 50000, 20, 50000, 10000000, 20);
      case 'ENTERPRISE':
      case 'CUSTOM':
        return new Quota(999, 999999, 100, 999999, 999999999, 999);
      default:
        return new Quota(1, 100, 1, 500, 10000, 1);
    }
  }
}
