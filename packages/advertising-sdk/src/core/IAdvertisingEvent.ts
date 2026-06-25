export interface IAdvertisingEvent {
  eventId: string;
  eventType: 'CampaignCreated' | 'CampaignPaused' | 'BudgetExceeded' | 'CreativeRejected' | string;
  entityType: 'Campaign' | 'AdGroup' | 'Creative' | 'Account';
  entityId: string;
  timestamp: Date;
  payload: Record<string, any>;
}
