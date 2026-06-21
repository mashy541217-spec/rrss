import { IUseCase, IEventBus, ApplicationException } from '@rrss-auto/application';
import { IWorkspaceRepository } from '../../../domain/repositories/IWorkspaceRepository';
import { WorkspaceId } from '../../../domain/value-objects/WorkspaceId';
import { SuspendWorkspaceCommand } from './SuspendWorkspaceCommand';

export class SuspendWorkspaceUseCase implements IUseCase<SuspendWorkspaceCommand, void> {
  constructor(
    private readonly workspaceRepository: IWorkspaceRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: SuspendWorkspaceCommand): Promise<void> {
    const id = WorkspaceId.create(command.workspaceId);
    
    const workspace = await this.workspaceRepository.findById(id);
    if (!workspace) {
      throw new ApplicationException(`Workspace not found`, 'WORKSPACE_NOT_FOUND');
    }

    workspace.suspend();

    await this.workspaceRepository.save(workspace);

    await this.eventBus.publishAll(workspace.domainEvents);
    workspace.clearDomainEvents();
  }
}
