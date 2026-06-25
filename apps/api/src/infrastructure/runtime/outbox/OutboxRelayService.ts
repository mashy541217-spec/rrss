import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/PrismaService';
import { LocalEventBus } from '../bus/LocalEventBus';
import { RetryEngine } from './RetryEngine';

@Injectable()
export class OutboxRelayService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OutboxRelayService.name);
  private timer: NodeJS.Timeout | null = null;
  private isProcessing = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: LocalEventBus,
    private readonly retryEngine: RetryEngine
  ) {}

  onModuleInit() {
    this.logger.log('OutboxRelayService started polling...');
    // Poll every 5 seconds
    this.timer = setInterval(() => this.processOutbox(), 5000);
  }

  onModuleDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  /**
   * Instantly trigger the relay to process pending messages.
   * Useful to call from UnitOfWork commit hooks for zero-latency processing.
   */
  async wakeUp(): Promise<void> {
    await this.processOutbox();
  }

  private async processOutbox() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      // Find messages that are PENDING or FAILED (and not dead lettered)
      const messages = await this.prisma.outboxMessage.findMany({
        where: {
          status: { in: ['PENDING', 'FAILED'] }
        },
        orderBy: { createdAt: 'asc' },
        take: 50 // Batch size
      });

      if (messages.length === 0) {
        return;
      }

      this.logger.debug(`Found ${messages.length} messages to process in Outbox.`);

      for (const message of messages) {
        try {
          const eventPayload = typeof message.payload === 'string' 
            ? JSON.parse(message.payload) 
            : message.payload;
            
          // Dynamically inject eventType into the payload so the bus knows what to route
          const event = { ...eventPayload, eventType: message.eventType };

          // Publish locally
          await this.eventBus.publish(event);

          // Mark as processed
          await this.prisma.outboxMessage.update({
            where: { id: message.id },
            data: { 
              status: 'PROCESSED',
              processedAt: new Date(),
              error: null
            }
          });
        } catch (error: any) {
          await this.retryEngine.handleFailure(message.id, error);
        }
      }
    } catch (error) {
      this.logger.error('Failed to process outbox messages', error);
    } finally {
      this.isProcessing = false;
    }
  }
}
