import { IECommerceEvent } from '../core/IECommerceEvent';

export class CommerceEventManager {
  private listeners: Array<(event: IECommerceEvent) => void> = [];

  subscribe(callback: (event: IECommerceEvent) => void) {
    this.listeners.push(callback);
  }

  emit(event: IECommerceEvent) {
    console.log(`[CommerceEvent] Emitting ${event.eventType} on ${event.entityType}:${event.entityId}`);
    this.listeners.forEach(listener => listener(event));
  }
}
