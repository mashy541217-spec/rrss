import { IUseCase, IEventBus } from '@rrss-auto/application';
import { IMembershipRepository } from '../../../domain/repositories/IMembershipRepository';
import { MembershipId } from '../../../domain/value-objects/MembershipId';
import { MembershipNotFoundException } from '../../../domain/exceptions/MembershipNotFoundException';
import { SuspendMembershipCommand } from './SuspendMembershipCommand';

export class SuspendMembershipUseCase implements IUseCase<SuspendMembershipCommand, void> {
  constructor(
    private readonly membershipRepository: IMembershipRepository,
    private readonly eventBus: IEventBus,
  ) {}

  public async execute(command: SuspendMembershipCommand): Promise<void> {
    const id = MembershipId.create(command.membershipId);
    const membership = await this.membershipRepository.findById(id);

    if (!membership) {
      throw new MembershipNotFoundException(`Membership with ID '${id.value}' was not found`);
    }

    membership.suspend(command.reason);

    await this.membershipRepository.save(membership);

    await this.eventBus.publishAll(membership.domainEvents);
    membership.clearDomainEvents();
  }
}
