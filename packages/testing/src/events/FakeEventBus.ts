import { IEventBus } from '@rrss-auto/application';
import { IDomainEvent } from '@rrss-auto/domain';

export class FakeEventBus implements IEventBus {
  private events: IDomainEvent[] = [];

  public async publish(event: IDomainEvent): Promise<void> {
    this.events.push(event);
  }

  public async publishAll(events: IDomainEvent[]): Promise<void> {
    this.events.push(...events);
  }

  public getPublishedEvents(): IDomainEvent[] {
    return [...this.events];
  }

  public assertPublished(eventClass: any): void {
    const found = this.events.some(e => e instanceof eventClass);
    if (!found) {
      throw new Error(`Expected event of type ${eventClass.name} to be published, but it was not.`);
    }
  }

  public assertPublishedTimes(eventClass: any, expectedCount: number): void {
    const count = this.events.filter(e => e instanceof eventClass).length;
    if (count !== expectedCount) {
      throw new Error(`Expected event of type ${eventClass.name} to be published ${expectedCount} times, but was published ${count} times.`);
    }
  }

  public assertNoEvents(): void {
    if (this.events.length > 0) {
      throw new Error(`Expected no events to be published, but found ${this.events.length} event(s).`);
    }
  }

  public clear(): void {
    this.events = [];
  }
}
