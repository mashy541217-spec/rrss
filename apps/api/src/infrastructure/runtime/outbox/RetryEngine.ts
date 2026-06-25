import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/PrismaService';
import { LocalDeadLetterQueue } from '../dlq/LocalDeadLetterQueue';

export interface IRetryEngine {
  handleFailure(messageId: string, error: Error): Promise<void>;
}

@Injectable()
export class RetryEngine implements IRetryEngine {
  private readonly MAX_RETRIES = 3;
  private readonly logger = new Logger(RetryEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly dlq: LocalDeadLetterQueue
  ) {}

  async handleFailure(messageId: string, error: Error): Promise<void> {
    const message = await this.prisma.outboxMessage.findUnique({
      where: { id: messageId }
    });

    if (!message) return;

    const newRetries = message.retries + 1;
    const errorMessage = error.message || error.toString();

    if (newRetries >= this.MAX_RETRIES) {
      this.logger.warn(`OutboxMessage ${messageId} reached max retries (${this.MAX_RETRIES}). Moving to DLQ.`);
      await this.dlq.moveToDeadLetter(messageId, errorMessage);
    } else {
      this.logger.log(`OutboxMessage ${messageId} failed. Retry ${newRetries}/${this.MAX_RETRIES}`);
      await this.prisma.outboxMessage.update({
        where: { id: messageId },
        data: {
          status: 'FAILED',
          retries: newRetries,
          error: errorMessage
        }
      });
    }
  }
}
