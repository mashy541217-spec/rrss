import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/PrismaService';

export interface IDeadLetterQueue {
  moveToDeadLetter(messageId: string, error: string): Promise<void>;
}

@Injectable()
export class LocalDeadLetterQueue implements IDeadLetterQueue {
  private readonly logger = new Logger(LocalDeadLetterQueue.name);

  constructor(private readonly prisma: PrismaService) {}

  async moveToDeadLetter(messageId: string, error: string): Promise<void> {
    this.logger.error(`Message ${messageId} moved to DLQ. Reason: ${error}`);
    
    await this.prisma.outboxMessage.update({
      where: { id: messageId },
      data: {
        status: 'DEAD_LETTER',
        error: error,
      }
    });
  }
}
