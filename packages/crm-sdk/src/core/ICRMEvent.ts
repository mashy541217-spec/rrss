export interface ICRMEvent {
  eventId: string;
  eventType: 'LeadCreated' | 'OpportunityWon' | 'OpportunityLost' | 'CaseClosed' | string;
  entityType: 'Lead' | 'Opportunity' | 'Account' | 'Contact' | 'Case';
  entityId: string;
  timestamp: Date;
  payload: Record<string, any>;
}
