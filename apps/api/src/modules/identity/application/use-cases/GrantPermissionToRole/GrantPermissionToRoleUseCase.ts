import { IUseCase, IEventBus } from '@rrss-auto/application';
import { IWorkspaceRoleRepository } from '../../../domain/repositories/IWorkspaceRoleRepository';
import { WorkspaceRoleId } from '../../../domain/value-objects/WorkspaceRoleId';
import { Permission } from '../../../domain/value-objects/Permission';
import { WorkspaceRoleNotFoundException } from '../../../domain/exceptions/WorkspaceRoleNotFoundException';
import { GrantPermissionToRoleCommand } from './GrantPermissionToRoleCommand';

export class GrantPermissionToRoleUseCase implements IUseCase<GrantPermissionToRoleCommand, void> {
  constructor(
    private readonly roleRepository: IWorkspaceRoleRepository,
    private readonly eventBus: IEventBus,
  ) {}

  public async execute(command: GrantPermissionToRoleCommand): Promise<void> {
    const id = WorkspaceRoleId.create(command.roleId);
    const role = await this.roleRepository.findById(id);

    if (!role) {
      throw new WorkspaceRoleNotFoundException(`Workspace role with ID '${id.value}' was not found`);
    }

    const permission = Permission.create(command.permission);
    role.addPermission(permission);

    await this.roleRepository.save(role);

    await this.eventBus.publishAll(role.domainEvents);
    role.clearDomainEvents();
  }
}
