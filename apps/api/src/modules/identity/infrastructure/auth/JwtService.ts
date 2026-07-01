import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';

/**
 * Lightweight JWT implementation using Node.js native `crypto` (HMAC-SHA256).
 * Avoids external dependencies (@nestjs/passport, jsonwebtoken).
 * Produces standard HS256 signed tokens compatible with any JWT library.
 */
@Injectable()
export class JwtService {
  private readonly secret: string;
  private readonly expiresInSeconds: number;

  constructor() {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
      throw new Error(
        'JWT_SECRET environment variable must be set and at least 32 characters long.',
      );
    }
    this.secret = secret;
    // Default: 7 days
    this.expiresInSeconds = parseInt(process.env.JWT_EXPIRES_IN_SECONDS ?? '604800', 10);
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  public sign(payload: Record<string, unknown>): string {
    const header = this.base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const body = this.base64UrlEncode(
      JSON.stringify({
        ...payload,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + this.expiresInSeconds,
      }),
    );
    const signature = this.hmac(`${header}.${body}`);
    return `${header}.${body}.${signature}`;
  }

  public verify(token: string): Record<string, unknown> {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT: malformed token');
    }

    const [header, body, signature] = parts;
    const expectedSignature = this.hmac(`${header}.${body}`);

    // Constant-time comparison to prevent timing attacks
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      throw new Error('Invalid JWT: signature verification failed');
    }

    const claims = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));

    if (claims.exp && claims.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Invalid JWT: token expired');
    }

    return claims;
  }

  public extractFromHeader(authHeader: string | undefined): Record<string, unknown> {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Missing or malformed Authorization header');
    }
    return this.verify(authHeader.slice(7));
  }

  // ─── Private helpers ────────────────────────────────────────────────────────

  private base64UrlEncode(input: string): string {
    return Buffer.from(input).toString('base64url');
  }

  private hmac(data: string): string {
    return crypto.createHmac('sha256', this.secret).update(data).digest('base64url');
  }
}
