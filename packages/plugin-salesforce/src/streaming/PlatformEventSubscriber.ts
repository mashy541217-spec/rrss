import { ICRMEvent } from '@rrss-auto/crm-sdk/dist/core/ICRMEvent';

export class PlatformEventSubscriber {
  /**
   * Represents the CometD / Streaming API listener
   */
  startListening(topics: string[], onEvent: (event: ICRMEvent) => void) {
    console.log(`[PlatformEventSubscriber] Subscribed to CometD topics: ${topics.join(', ')}`);
    
    // Simulate an incoming Change Data Capture (CDC) event
    setTimeout(() => {
      const crmEvent: ICRMEvent = {
        eventId: `sf-event-${Date.now()}`,
        eventType: 'OpportunityWon',
        entityType: 'Opportunity',
        entityId: '006xx000001aBcd',
        timestamp: new Date(),
        payload: { StageName: 'Closed Won' }
      };
      
      console.log(`[PlatformEventSubscriber] Received CDC Event, translating to CRM SDK standard format.`);
      onEvent(crmEvent);
    }, 2000);
  }
}
