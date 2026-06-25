import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUseCase, IEventBus, ApplicationException } from '@rrss-auto/application';
import { IWorkspaceRepository } from '../../../domain/repositories/IWorkspaceRepository';
import { WorkspaceId } from '../../../domain/value-objects/WorkspaceId';
import { WorkspaceSettings } from '../../../domain/value-objects/WorkspaceSettings';
import { WorkspaceTimezone } from '../../../domain/value-objects/WorkspaceTimezone';
import { UpdateWorkspaceSettingsCommand } from './UpdateWorkspaceSettingsCommand';

@Injectable()
@CommandHandler(UpdateWorkspaceSettingsCommand)
export class UpdateWorkspaceSettingsUseCase implements IUseCase<UpdateWorkspaceSettingsCommand, void>, ICommandHandler<UpdateWorkspaceSettingsCommand, void> {
  constructor(
    @Inject('IWorkspaceRepository') private readonly workspaceRepository: IWorkspaceRepository,
    @Inject('IEventBus') private readonly eventBus: IEventBus
  ) {}

  public async execute(command: UpdateWorkspaceSettingsCommand): Promise<void> {
    const id = WorkspaceId.create(command.workspaceId);
    
    const workspace = await this.workspaceRepository.findById(id);
    if (!workspace) {
      throw new ApplicationException(`Workspace not found`, 'WORKSPACE_NOT_FOUND');
    }

    const timezone = WorkspaceTimezone.create(command.timezone);
    const newSettings = WorkspaceSettings.create(timezone, command.locale);

    workspace.updateSettings(newSettings);

    await this.workspaceRepository.save(workspace);

    await this.eventBus.publishAll(workspace.domainEvents);
    workspace.clearDomainEvents();
  }
}
