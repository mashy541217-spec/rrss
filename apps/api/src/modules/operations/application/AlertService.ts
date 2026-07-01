import { Injectable, Logger } from '@nestjs/common';
import { AlertEntry, AlertType, AlertSeverity } from '../domain/OperationsTypes';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);

  // In-memory store — production should persist to PostgreSQL with user-level dismissal
  private readonly activeAlerts: Map<string, AlertEntry> = new Map();

  public raise(
    type: AlertType,
    severity: AlertSeverity,
    title: string,
    message: string,
    entityId?: string,
  ): AlertEntry {
    const alert: AlertEntry = {
      id: uuidv4(),
      type,
      severity,
      title,
      message,
      entityId,
      createdAt: new Date(),
    };

    this.activeAlerts.set(alert.id, alert);
    this.logger.warn(`[Alert] ${severity.toUpperCase()} — ${title}: ${message}`);
    return alert;
  }

  public acknowledge(alertId: string): boolean {
    const alert = this.activeAlerts.get(alertId);
    if (!alert) return false;
    alert.acknowledgedAt = new Date();
    return true;
  }

  public getActiveAlerts(): AlertEntry[] {
    return Array.from(this.activeAlerts.values())
      .filter(a => !a.acknowledgedAt)
      .sort((a, b) => {
        const severityOrder: Record<AlertSeverity, number> = { critical: 0, high: 1, medium: 2, low: 3 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      });
  }

  // ─── Convenience Factories ───────────────────────────────────────────────────

  public workerOffline(workerId: string): AlertEntry {
    return this.raise('WorkerOffline', 'critical',
      'Worker offline',
      `Worker ${workerId} has stopped sending heartbeats and has been declared Dead.`,
      workerId,
    );
  }

  public workerUnhealthy(workerId: string, reason: string): AlertEntry {
    return this.raise('WorkerUnhealthy', 'high',
      'Worker unhealthy',
      `Worker ${workerId} is reporting unhealthy metrics: ${reason}`,
      workerId,
    );
  }

  public credentialsExpiring(accountId: string, provider: string, hoursLeft: number): AlertEntry {
    return this.raise('TokenExpiration', hoursLeft < 2 ? 'critical' : 'high',
      `${provider} credentials expiring`,
      `OAuth token for account ${accountId} expires in ${hoursLeft}h. Please reconnect.`,
      accountId,
    );
  }

  public publicationFailed(publicationId: string, error: string): AlertEntry {
    return this.raise('PublicationFailed', 'high',
      'Publication failed',
      `Publication ${publicationId} could not be delivered: ${error}`,
      publicationId,
    );
  }

  public automationError(workflowId: string, nodeId: string, error: string): AlertEntry {
    return this.raise('AutomationError', 'medium',
      'Automation error',
      `Workflow ${workflowId} stalled at node ${nodeId}: ${error}`,
      workflowId,
    );
  }
}
