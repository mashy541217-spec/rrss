export enum SubscriptionTier {
  FREE = 'FREE',
  STARTER = 'STARTER',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE',
  CUSTOM = 'CUSTOM'
}

export class Subscription {
  constructor(
    public readonly tier: SubscriptionTier,
    public readonly stripeCustomerId?: string,
    public readonly stripeSubscriptionId?: string,
    public readonly validUntil?: Date
  ) {}

  isActive(): boolean {
    if (!this.validUntil) return true; // Lifetime or free
    return this.validUntil > new Date();
  }
}
