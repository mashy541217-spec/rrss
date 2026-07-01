import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';

/**
 * Centralised password hashing service.
 * Uses PBKDF2-SHA512 with 100,000 iterations — OWASP recommended minimum.
 * Format: "pbkdf2:sha256:<iterations>:<salt_base64>:<hash_base64>"
 *
 * This service is used by RegisterUserUseCase (to hash) and
 * LoginUserUseCase (to verify) ensuring a single consistent algorithm.
 */
@Injectable()
export class PasswordHashingService {
  private readonly ALGORITHM = 'sha512';
  private readonly ITERATIONS = 100_000;
  private readonly KEY_LENGTH = 64;

  public hash(plainPassword: string): string {
    const salt = crypto.randomBytes(32).toString('base64');
    const derived = crypto
      .pbkdf2Sync(plainPassword, Buffer.from(salt, 'base64'), this.ITERATIONS, this.KEY_LENGTH, this.ALGORITHM)
      .toString('base64');

    return `pbkdf2:sha256:${this.ITERATIONS}:${salt}:${derived}`;
  }

  public verify(plainPassword: string, storedHash: string): boolean {
    try {
      if (!storedHash.startsWith('pbkdf2:')) return false;

      const parts = storedHash.split(':');
      if (parts.length !== 5) return false;

      const [, , iterStr, salt, expectedHash] = parts;
      const iterations = parseInt(iterStr, 10);

      const derived = crypto
        .pbkdf2Sync(plainPassword, Buffer.from(salt, 'base64'), iterations, this.KEY_LENGTH, this.ALGORITHM)
        .toString('base64');

      if (derived.length !== expectedHash.length) return false;

      return crypto.timingSafeEqual(
        Buffer.from(derived, 'base64'),
        Buffer.from(expectedHash, 'base64'),
      );
    } catch {
      return false;
    }
  }
}
