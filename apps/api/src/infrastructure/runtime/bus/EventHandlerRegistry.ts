import { Injectable, Type } from '@nestjs/common';
import { IEventHandler } from '@rrss-auto/domain';

@Injectable()
export class EventHandlerRegistry {
  private readonly handlers = new Map<string, IEventHandler[]>();

  register(eventType: string, handler: IEventHandler): void {
    const existing = this.handlers.get(eventType) || [];
    existing.push(handler);
    this.handlers.set(eventType, existing);
  }

  getHandlers(eventType: string): IEventHandler[] {
    return this.handlers.get(eventType) || [];
  }
}
