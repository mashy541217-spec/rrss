import { Module, Global } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { EventHandlerRegistry } from './bus/EventHandlerRegistry';
import { LocalEventBus } from './bus/LocalEventBus';
import { LocalDeadLetterQueue } from './dlq/LocalDeadLetterQueue';
import { RetryEngine } from './outbox/RetryEngine';
import { OutboxRelayService } from './outbox/OutboxRelayService';
import { PrismaService } from '../database/prisma/PrismaService';

@Global()
@Module({
  providers: [
    PrismaService, // Re-provided just for local DI, although typical in NestJS to import a shared module
    EventHandlerRegistry,
    LocalEventBus,
    LocalDeadLetterQueue,
    RetryEngine,
    OutboxRelayService,
    {
      provide: 'IEventBus',
      useExisting: LocalEventBus
    },
    {
      provide: 'IIdentifierProvider',
      useValue: { nextId: () => randomUUID() }
    }
  ],
  exports: [
    'IEventBus',
    'IIdentifierProvider',
    LocalEventBus,
    OutboxRelayService
  ]
})
export class RuntimeModule {}
