import { IUseCase, IEventBus } from '@rrss-auto/application';
import { IIdentifierProvider } from '@rrss-auto/domain';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UserFactory } from '../../../domain/factories/UserFactory';
import { UserId } from '../../../domain/value-objects/UserId';
import { Email } from '../../../domain/value-objects/Email';
import { DisplayName } from '../../../domain/value-objects/DisplayName';
import { PasswordHash } from '../../../domain/value-objects/PasswordHash';
import { UserEmailAlreadyExistsException } from '../../../domain/exceptions/UserEmailAlreadyExistsException';
import { RegisterUserCommand } from './RegisterUserCommand';

export class RegisterUserUseCase implements IUseCase<RegisterUserCommand, string> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly eventBus: IEventBus,
    private readonly identifierProvider: IIdentifierProvider,
  ) {}

  public async execute(command: RegisterUserCommand): Promise<string> {
    const email = Email.create(command.email);
    const displayName = DisplayName.create(command.displayName);
    const passwordHash = PasswordHash.create(command.passwordHash);

    const exists = await this.userRepository.existsByEmail(email);
    if (exists) {
      throw new UserEmailAlreadyExistsException(
        `A user with email '${email.value}' already exists`,
      );
    }

    const rawId = this.identifierProvider.nextId();
    const id = UserId.create(rawId);

    const user = UserFactory.create({
      id,
      email,
      displayName,
      passwordHash,
    });

    await this.userRepository.save(user);

    await this.eventBus.publishAll(user.domainEvents);
    user.clearDomainEvents();

    return rawId;
  }
}
