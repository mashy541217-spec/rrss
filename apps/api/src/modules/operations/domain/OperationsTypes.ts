// ─── Activity Feed Types ──────────────────────────────────────────────────────

export type ActivityType =
  | 'PublicationStarted'
  | 'PublicationCompleted'
  | 'PublicationFailed'
  | 'WorkerAssigned'
  | 'WorkerRestarted'
  | 'AutomationTriggered'
  | 'CampaignFinished'
  | 'WebhookReceived'
  | 'AnalyticsUpdated';

export type ActivitySeverity = 'info' | 'success' | 'warning' | 'error';

export interface ActivityEntry {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  severity: ActivitySeverity;
  entityId: string;
  entityType: 'Publication' | 'Campaign' | 'Worker' | 'Automation' | 'Webhook';
  timestamp: Date;
}

// ─── Alert Types ─────────────────────────────────────────────────────────────

export type AlertType =
  | 'WorkerOffline'
  | 'WorkerUnhealthy'
  | 'PublicationFailed'
  | 'CampaignFailed'
  | 'ExpiredCredentials'
  | 'QuotaWarning'
  | 'TokenExpiration'
  | 'AutomationError';

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface AlertEntry {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  entityId?: string;
  acknowledgedAt?: Date;
  createdAt: Date;
}

// ─── Operations Summary ───────────────────────────────────────────────────────

export interface OperationsSummaryDto {
  runningCampaigns: number;
  queuedPublications: number;
  publishingJobs: number;
  completedToday: number;
  automationExecutions: number;
  connectedSocialAccounts: number;
  connectedWorkers: number;
  todayReach: number;
  todayEngagement: number;
  todayGrowth: number;
  businessScore: number;
  calculatedAt: Date;
}

// ─── Business Health Score ────────────────────────────────────────────────────

export interface BusinessHealthDto {
  automationHealth: number;  // 0-100
  campaignHealth: number;    // 0-100
  publicationHealth: number; // 0-100
  workerHealth: number;      // 0-100
  analyticsHealth: number;   // 0-100
  overallScore: number;      // Weighted composite 0-100
}
