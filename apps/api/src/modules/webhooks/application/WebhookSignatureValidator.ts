import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class WebhookSignatureValidator {
  private readonly logger = new Logger(WebhookSignatureValidator.name);
  
  private readonly appSecret: string;

  constructor() {
    const secret = process.env.META_APP_SECRET;
    if (!secret) {
      throw new Error('META_APP_SECRET environment variable is not set. Webhook validation cannot proceed.');
    }
    this.appSecret = secret;
  }

  public validateMetaSignature(payload: string, signatureHeader: string): boolean {
    if (!signatureHeader || !signatureHeader.startsWith('sha256=')) {
      this.logger.warn('Missing or malformed X-Hub-Signature-256 header');
      return false;
    }

    const signature = signatureHeader.split('sha256=')[1];
    const expectedSignature = crypto
      .createHmac('sha256', this.appSecret)
      .update(payload)
      .digest('hex');

    if (signature !== expectedSignature) {
      this.logger.error('Webhook signature mismatch. Potential spoofing attempt.');
      return false;
    }

    return true;
  }
}
