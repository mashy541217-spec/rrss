export interface SocialRateLimit {
  readonly limit: number;
  readonly remaining: number;
  readonly resetTime: Date;
}
