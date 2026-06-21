import { Specification } from '@rrss-auto/domain';
import { Invitation } from '../aggregates/Invitation';

export class InvitationIsValidSpecification extends Specification<Invitation> {
  public isSatisfiedBy(invitation: Invitation): boolean {
    return invitation.isPending && !invitation.isExpired;
  }
}
