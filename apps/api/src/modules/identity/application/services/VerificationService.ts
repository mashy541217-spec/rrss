import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class VerificationService {
  private readonly verificationCodes = new Map<string, string>();
  private readonly logger = new Logger(VerificationService.name);

  public storeVerificationCode(userId: string): string {
    const code = Math.floor(100_000 + Math.random() * 900_000).toString();
    this.verificationCodes.set(userId, code);
    return code;
  }

  public verifyCode(userId: string, code: string): boolean {
    const storedCode = this.verificationCodes.get(userId);
    if (!storedCode || storedCode !== code) {
      return false;
    }
    this.verificationCodes.delete(userId);
    this.logger.log(`User ${userId} verified`);
    return true;
  }
}
