import { Specification } from '@rrss-auto/domain';
import { User } from '../aggregates/User';
import { UserStatus } from '../enums/UserStatus';

export class UserCanBeSuspendedSpecification extends Specification<User> {
  public isSatisfiedBy(user: User): boolean {
    return user.status === UserStatus.Active;
  }
}
