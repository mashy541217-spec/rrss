export interface CookieSessionConfiguration {
  readonly type: 'CookieSession';
  readonly cookies: Record<string, string>;
  readonly userAgent?: string;
}
