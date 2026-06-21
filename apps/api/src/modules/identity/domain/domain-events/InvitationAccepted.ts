import { IDomainEvent } from '@rrss-auto/domain';
import { InvitationId } from '../value-objects/InvitationId';

export class InvitationAccepted implements IDomainEvent {
  public readonly occurredAt: Date;

  constructor(
    public readonly invitationId: InvitationId,
    public readonly userId: string,
    public readonly workspaceId: string,
  ) {
    this.occurredAt = new Date();
  }

  getAggregateId(): InvitationId {
    return this.invitationId;
  }
}
