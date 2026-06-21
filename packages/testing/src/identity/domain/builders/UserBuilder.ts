import { User } from '../../../../../../apps/api/src/modules/identity/domain/aggregates/User';
import { UserId } from '../../../../../../apps/api/src/modules/identity/domain/value-objects/UserId';
import { Email } from '../../../../../../apps/api/src/modules/identity/domain/value-objects/Email';
import { DisplayName } from '../../../../../../apps/api/src/modules/identity/domain/value-objects/DisplayName';
import { PasswordHash } from '../../../../../../apps/api/src/modules/identity/domain/value-objects/PasswordHash';
import { UserStatus } from '../../../../../../apps/api/src/modules/identity/domain/enums/UserStatus';

export class UserBuilder {
  private id: string = 'usr-123';
  private email: string = 'test@example.com';
  private displayName: string = 'Test User';
  private passwordHash: string = 'hashed-password';
  private status: UserStatus = UserStatus.Active;

  public static create(): UserBuilder {
    return new UserBuilder();
  }

  public withId(id: string): this {
    this.id = id;
    return this;
  }

  public withEmail(email: string): this {
    this.email = email;
    return this;
  }

  public withDisplayName(displayName: string): this {
    this.displayName = displayName;
    return this;
  }

  public withPasswordHash(passwordHash: string): this {
    this.passwordHash = passwordHash;
    return this;
  }

  public withStatus(status: UserStatus): this {
    this.status = status;
    return this;
  }

  public build(): User {
    return User.initialize(
      {
        email: Email.create(this.email),
        displayName: DisplayName.create(this.displayName),
        passwordHash: PasswordHash.create(this.passwordHash),
        status: this.status,
      },
      UserId.create(this.id),
    );
  }
}
