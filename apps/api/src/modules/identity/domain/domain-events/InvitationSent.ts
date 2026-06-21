import { IDomainEvent } from '@rrss-auto/domain';
import { InvitationId } from '../value-objects/InvitationId';

export class InvitationSent implements IDomainEvent {
  public readonly occurredAt: Date;

  constructor(
    public readonly invitationId: InvitationId,
    public readonly email: string,
    public readonly workspaceId: string,
    public readonly roleId: string,
  ) {
    this.occurredAt = new Date();
  }

  getAggregateId(): InvitationId {
    return this.invitationId;
  }
}
