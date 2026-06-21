import { IUseCase, IEventBus, ApplicationException } from '@rrss-auto/application';
import { IIdentifierProvider } from '@rrss-auto/domain';
import { IInvitationRepository } from '../../../domain/repositories/IInvitationRepository';
import { IMembershipRepository } from '../../../domain/repositories/IMembershipRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { InvitationId } from '../../../domain/value-objects/InvitationId';
import { UserId } from '../../../domain/value-objects/UserId';
import { MembershipId } from '../../../domain/value-objects/MembershipId';
import { MembershipFactory } from '../../../domain/factories/MembershipFactory';
import { InvitationNotFoundException } from '../../../domain/exceptions/InvitationNotFoundException';
import { UserNotFoundException } from '../../../domain/exceptions/UserNotFoundException';
import { AcceptInvitationCommand } from './AcceptInvitationCommand';

export class AcceptInvitationUseCase implements IUseCase<AcceptInvitationCommand, string> {
  constructor(
    private readonly invitationRepository: IInvitationRepository,
    private readonly membershipRepository: IMembershipRepository,
    private readonly userRepository: IUserRepository,
    private readonly eventBus: IEventBus,
    private readonly identifierProvider: IIdentifierProvider,
  ) {}

  public async execute(command: AcceptInvitationCommand): Promise<string> {
    const invitationId = InvitationId.create(command.invitationId);
    const userId = UserId.create(command.userId);

    // 1. Check user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException(`User with ID '${userId.value}' was not found`);
    }

    // 2. Check invitation exists
    const invitation = await this.invitationRepository.findById(invitationId);
    if (!invitation) {
      throw new InvitationNotFoundException(`Invitation with ID '${invitationId.value}' was not found`);
    }

    // 3. Accept invitation (mutates status, checks token and expiry, adds event)
    invitation.accept(command.token, userId.value);

    // 4. Check if membership already exists for this user in the workspace
    const existingMembership = await this.membershipRepository.findByUserAndWorkspace(
      userId,
      invitation.workspaceRef,
    );
    if (existingMembership) {
      throw new ApplicationException(
        `User '${userId.value}' already has a membership in workspace '${invitation.workspaceRef.value}'`,
        'MEMBERSHIP_ALREADY_EXISTS',
      );
    }

    // 5. Create new Membership (via Invite -> Accept workflow)
    const rawMembershipId = this.identifierProvider.nextId();
    const membershipId = MembershipId.create(rawMembershipId);

    const membership = MembershipFactory.invite({
      id: membershipId,
      userId,
      workspaceRef: invitation.workspaceRef,
      roleId: invitation.roleId,
    });

    membership.accept();

    // 6. Save both aggregates
    await this.invitationRepository.save(invitation);
    await this.membershipRepository.save(membership);

    // 7. Publish all events
    await this.eventBus.publishAll([
      ...invitation.domainEvents,
      ...membership.domainEvents,
    ]);

    invitation.clearDomainEvents();
    membership.clearDomainEvents();

    return rawMembershipId;
  }
}
