import { IUseCase, IEventBus, ApplicationException } from '@rrss-auto/application';
import { IIdentifierProvider } from '@rrss-auto/domain';
import { IWorkspaceRoleRepository } from '../../../domain/repositories/IWorkspaceRoleRepository';
import { WorkspaceRoleFactory } from '../../../domain/factories/WorkspaceRoleFactory';
import { WorkspaceRoleId } from '../../../domain/value-objects/WorkspaceRoleId';
import { WorkspaceRef } from '../../../domain/value-objects/WorkspaceRef';
import { Permission } from '../../../domain/value-objects/Permission';
import { CreateWorkspaceRoleCommand } from './CreateWorkspaceRoleCommand';

export class CreateWorkspaceRoleUseCase implements IUseCase<CreateWorkspaceRoleCommand, string> {
  constructor(
    private readonly roleRepository: IWorkspaceRoleRepository,
    private readonly eventBus: IEventBus,
    private readonly identifierProvider: IIdentifierProvider,
  ) {}

  public async execute(command: CreateWorkspaceRoleCommand): Promise<string> {
    const workspaceRef = WorkspaceRef.create(command.workspaceRef);

    const existing = await this.roleRepository.findByNameAndWorkspace(
      command.name,
      workspaceRef,
    );

    if (existing) {
      throw new ApplicationException(
        `Workspace role with name '${command.name}' already exists in workspace '${command.workspaceRef}'`,
        'WORKSPACE_ROLE_ALREADY_EXISTS',
      );
    }

    const rawId = this.identifierProvider.nextId();
    const id = WorkspaceRoleId.create(rawId);

    const permissions = command.initialPermissions.map((p) => Permission.create(p));

    const role = WorkspaceRoleFactory.create({
      id,
      name: command.name,
      description: command.description,
      workspaceRef,
      initialPermissions: permissions,
    });

    await this.roleRepository.save(role);

    await this.eventBus.publishAll(role.domainEvents);
    role.clearDomainEvents();

    return rawId;
  }
}
