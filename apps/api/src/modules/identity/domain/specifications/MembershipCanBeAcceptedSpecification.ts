import { Specification } from '@rrss-auto/domain';
import { Membership } from '../aggregates/Membership';
import { MembershipStatus } from '../enums/MembershipStatus';

export class MembershipCanBeAcceptedSpecification extends Specification<Membership> {
  public isSatisfiedBy(membership: Membership): boolean {
    return (
      membership.status === MembershipStatus.Invited ||
      membership.status === MembershipStatus.Pending
    );
  }
}
