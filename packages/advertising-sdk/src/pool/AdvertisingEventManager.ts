import { IAdvertisingEvent } from '../core/IAdvertisingEvent';

export class AdvertisingEventManager {
  private listeners: Array<(event: IAdvertisingEvent) => void> = [];

  subscribe(callback: (event: IAdvertisingEvent) => void) {
    this.listeners.push(callback);
  }

  emit(event: IAdvertisingEvent) {
    console.log(`[AdsEvent] Emitting ${event.eventType} on ${event.entityType}:${event.entityId}`);
    this.listeners.forEach(listener => listener(event));
  }
}
