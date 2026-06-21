import { IUseCase, IEventBus, ApplicationException } from '@rrss-auto/application';
import { IIdentifierProvider } from '@rrss-auto/domain';
import { IInvitationRepository } from '../../../domain/repositories/IInvitationRepository';
import { IWorkspaceRoleRepository } from '../../../domain/repositories/IWorkspaceRoleRepository';
import { WorkspaceRoleId } from '../../../domain/value-objects/WorkspaceRoleId';
import { WorkspaceRef } from '../../../domain/value-objects/WorkspaceRef';
import { Email } from '../../../domain/value-objects/Email';
import { InvitationToken } from '../../../domain/value-objects/InvitationToken';
import { InvitationId } from '../../../domain/value-objects/InvitationId';
import { InvitationFactory } from '../../../domain/factories/InvitationFactory';
import { WorkspaceRoleNotFoundException } from '../../../domain/exceptions/WorkspaceRoleNotFoundException';
import { SendInvitationCommand } from './SendInvitationCommand';

export class SendInvitationUseCase implements IUseCase<SendInvitationCommand, string> {
  constructor(
    private readonly invitationRepository: IInvitationRepository,
    private readonly roleRepository: IWorkspaceRoleRepository,
    private readonly eventBus: IEventBus,
    private readonly identifierProvider: IIdentifierProvider,
  ) {}

  public async execute(command: SendInvitationCommand): Promise<string> {
    const email = Email.create(command.email);
    const workspaceRef = WorkspaceRef.create(command.workspaceRef);
    const roleId = WorkspaceRoleId.create(command.roleId);
    const token = InvitationToken.create(command.token);

    // 1. Check if role exists and belongs to the workspace
    const role = await this.roleRepository.findById(roleId);
    if (!role) {
      throw new WorkspaceRoleNotFoundException(`Workspace role with ID '${roleId.value}' was not found`);
    }
    if (role.workspaceRef.value !== workspaceRef.value) {
      throw new ApplicationException(
        `Workspace role '${roleId.value}' does not belong to workspace '${workspaceRef.value}'`,
        'INVALID_ROLE_WORKSPACE',
      );
    }

    // 2. Check if a pending invitation already exists for this email and workspace
    const existing = await this.invitationRepository.findPendingByEmailAndWorkspace(
      email,
      workspaceRef,
    );
    if (existing) {
      throw new ApplicationException(
        `A pending invitation already exists for '${email.value}' in workspace '${workspaceRef.value}'`,
        'INVITATION_ALREADY_PENDING',
      );
    }

    // 3. Generate Invitation ID
    const rawId = this.identifierProvider.nextId();
    const id = InvitationId.create(rawId);

    // 4. Create and Save
    const invitation = InvitationFactory.send({
      id,
      email,
      workspaceRef,
      roleId,
      token,
      expiresAt: command.expiresAt,
    });

    await this.invitationRepository.save(invitation);

    await this.eventBus.publishAll(invitation.domainEvents);
    invitation.clearDomainEvents();

    return rawId;
  }
}
