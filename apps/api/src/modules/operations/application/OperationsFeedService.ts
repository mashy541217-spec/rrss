import { Injectable, Logger } from '@nestjs/common';
import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ActivityEntry, ActivityType, ActivitySeverity } from '../domain/OperationsTypes';
import { v4 as uuidv4 } from 'uuid';

// We subscribe to domain events from other modules and convert them into
// generic ActivityEntry objects for the Operations Center.

@Injectable()
export class OperationsFeedService {
  private readonly logger = new Logger(OperationsFeedService.name);

  // In-memory ring buffer — production should back this with Redis or DB
  private readonly activityRingBuffer: ActivityEntry[] = [];
  private readonly MAX_BUFFER_SIZE = 200;

  constructor(private readonly eventBus: EventBus) {}

  /**
   * Called by event handlers that intercept domain events from other modules.
   * Maps domain event data to a provider-agnostic ActivityEntry.
   */
  public recordActivity(
    type: ActivityType,
    title: string,
    description: string,
    severity: ActivitySeverity,
    entityId: string,
    entityType: ActivityEntry['entityType'],
  ): ActivityEntry {
    const entry: ActivityEntry = {
      id: uuidv4(),
      type,
      title,
      description,
      severity,
      entityId,
      entityType,
      timestamp: new Date(),
    };

    // Maintain ring buffer
    this.activityRingBuffer.unshift(entry);
    if (this.activityRingBuffer.length > this.MAX_BUFFER_SIZE) {
      this.activityRingBuffer.pop();
    }

    this.logger.log(`[Activity] ${severity.toUpperCase()}: ${title}`);
    return entry;
  }

  public getRecentActivities(limit = 50): ActivityEntry[] {
    return this.activityRingBuffer.slice(0, limit);
  }

  // ─── Convenience Factory Methods ────────────────────────────────────────────

  public publicationStarted(publicationId: string, title: string): ActivityEntry {
    return this.recordActivity(
      'PublicationStarted', `Publishing: ${title}`,
      `Publication ${publicationId} has been queued for delivery.`,
      'info', publicationId, 'Publication',
    );
  }

  public publicationCompleted(publicationId: string): ActivityEntry {
    return this.recordActivity(
      'PublicationCompleted', 'Publication delivered',
      `Publication ${publicationId} was delivered successfully.`,
      'success', publicationId, 'Publication',
    );
  }

  public publicationFailed(publicationId: string, reason: string): ActivityEntry {
    return this.recordActivity(
      'PublicationFailed', 'Publication failed',
      `Publication ${publicationId} failed: ${reason}`,
      'error', publicationId, 'Publication',
    );
  }

  public workerAssigned(workerId: string, jobType: string): ActivityEntry {
    return this.recordActivity(
      'WorkerAssigned', `Worker assigned: ${jobType}`,
      `Worker ${workerId} was assigned a new ${jobType} job.`,
      'info', workerId, 'Worker',
    );
  }

  public workerRestarted(workerId: string): ActivityEntry {
    return this.recordActivity(
      'WorkerRestarted', 'Worker restarted',
      `Worker ${workerId} has reconnected after a brief disconnection.`,
      'warning', workerId, 'Worker',
    );
  }

  public automationTriggered(workflowId: string): ActivityEntry {
    return this.recordActivity(
      'AutomationTriggered', 'Automation started',
      `Workflow ${workflowId} has been triggered and is now compiling.`,
      'info', workflowId, 'Automation',
    );
  }

  public webhookReceived(provider: string, entityId: string): ActivityEntry {
    return this.recordActivity(
      'WebhookReceived', `Webhook: ${provider}`,
      `Real-time update received from ${provider}.`,
      'info', entityId, 'Webhook',
    );
  }
}
