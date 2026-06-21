import { IUseCase, IEventBus, ApplicationException } from '@rrss-auto/application';
import { IIdentifierProvider } from '@rrss-auto/domain';
import { WorkspaceFactory } from '../../../domain/factories/WorkspaceFactory';
import { IWorkspaceRepository } from '../../../domain/repositories/IWorkspaceRepository';
import { WorkspaceId } from '../../../domain/value-objects/WorkspaceId';
import { WorkspaceName } from '../../../domain/value-objects/WorkspaceName';
import { WorkspaceSlug } from '../../../domain/value-objects/WorkspaceSlug';
import { WorkspaceOwnerId } from '../../../domain/value-objects/WorkspaceOwnerId';
import { WorkspaceSettings } from '../../../domain/value-objects/WorkspaceSettings';
import { WorkspaceTimezone } from '../../../domain/value-objects/WorkspaceTimezone';
import { WorkspaceLimits } from '../../../domain/value-objects/WorkspaceLimits';
import { CreateWorkspaceCommand } from './CreateWorkspaceCommand';

export class CreateWorkspaceUseCase implements IUseCase<CreateWorkspaceCommand, string> {
  constructor(
    private readonly workspaceRepository: IWorkspaceRepository,
    private readonly eventBus: IEventBus,
    private readonly identifierProvider: IIdentifierProvider
  ) {}

  public async execute(command: CreateWorkspaceCommand): Promise<string> {
    const rawId = this.identifierProvider.nextId();
    const id = WorkspaceId.create(rawId);

    const name = WorkspaceName.create(command.name);
    const slug = WorkspaceSlug.create(command.slug);
    const ownerId = WorkspaceOwnerId.create(command.ownerId);
    
    const timezone = WorkspaceTimezone.create(command.timezone);
    const settings = WorkspaceSettings.create(timezone, command.locale);
    
    const limits = WorkspaceLimits.create(command.limits);

    const existing = await this.workspaceRepository.findByName(name);
    if (existing) {
      throw new ApplicationException(`Workspace with name '${name.value}' already exists`, 'WORKSPACE_ALREADY_EXISTS');
    }

    const workspace = WorkspaceFactory.create({
      id,
      name,
      slug,
      ownerId,
      settings,
      limits
    });

    await this.workspaceRepository.save(workspace);

    await this.eventBus.publishAll(workspace.domainEvents);
    workspace.clearDomainEvents();

    return rawId;
  }
}
