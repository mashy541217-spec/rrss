import { Entity } from '../entity/Entity';
import { ValueObject } from '../value-object/ValueObject';
import { IDomainEvent } from '../domain-event/DomainEvent';

export abstract class AggregateRoot<T, ID extends ValueObject<any>> extends Entity<T, ID> {
  private _domainEvents: IDomainEvent[] = [];

  protected constructor(props: T, id: ID) {
    super(props, id);
  }

  get domainEvents(): IDomainEvent[] {
    return [...this._domainEvents];
  }

  protected addDomainEvent(domainEvent: IDomainEvent): void {
    this._domainEvents.push(domainEvent);
  }

  public clearDomainEvents(): void {
    this._domainEvents = [];
  }
}
