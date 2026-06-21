import { IUseCase, IEventBus } from '@rrss-auto/application';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UserId } from '../../../domain/value-objects/UserId';
import { UserNotFoundException } from '../../../domain/exceptions/UserNotFoundException';
import { VerifyUserCommand } from './VerifyUserCommand';

export class VerifyUserUseCase implements IUseCase<VerifyUserCommand, void> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly eventBus: IEventBus,
  ) {}

  public async execute(command: VerifyUserCommand): Promise<void> {
    const id = UserId.create(command.userId);
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundException(`User with ID '${id.value}' was not found`);
    }

    user.verify();

    await this.userRepository.save(user);

    await this.eventBus.publishAll(user.domainEvents);
    user.clearDomainEvents();
  }
}
