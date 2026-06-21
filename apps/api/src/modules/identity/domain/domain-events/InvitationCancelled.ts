import { IDomainEvent } from '@rrss-auto/domain';
import { InvitationId } from '../value-objects/InvitationId';

export class InvitationCancelled implements IDomainEvent {
  public readonly occurredAt: Date;

  constructor(public readonly invitationId: InvitationId) {
    this.occurredAt = new Date();
  }

  getAggregateId(): InvitationId {
    return this.invitationId;
  }
}
