import { ICRMEvent } from '../core/ICRMEvent';

export class CRMEventManager {
  private listeners: Array<(event: ICRMEvent) => void> = [];

  /**
   * Internal orchestrator registers a listener.
   */
  subscribe(callback: (event: ICRMEvent) => void) {
    this.listeners.push(callback);
  }

  /**
   * The provider adapter calls this when a raw webhook is received,
   * converting it into a standardized ICRMEvent.
   */
  emit(event: ICRMEvent) {
    console.log(`[CRMEvent] Emitting ${event.eventType} on ${event.entityType}:${event.entityId}`);
    this.listeners.forEach(listener => listener(event));
  }
}
