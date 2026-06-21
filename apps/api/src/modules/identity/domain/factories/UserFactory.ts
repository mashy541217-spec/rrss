import { User, UserProps } from '../aggregates/User';
import { UserId } from '../value-objects/UserId';
import { Email } from '../value-objects/Email';
import { PasswordHash } from '../value-objects/PasswordHash';
import { DisplayName } from '../value-objects/DisplayName';

export interface CreateUserProps {
  id: UserId;
  email: Email;
  displayName: DisplayName;
  passwordHash: PasswordHash;
}

export class UserFactory {
  public static create(props: CreateUserProps): User {
    return User.createNew(
      {
        email: props.email,
        displayName: props.displayName,
        passwordHash: props.passwordHash,
      },
      props.id,
    );
  }
}
