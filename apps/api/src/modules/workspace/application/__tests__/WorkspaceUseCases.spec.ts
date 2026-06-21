import { CreateWorkspaceUseCase } from '../use-cases/CreateWorkspace/CreateWorkspaceUseCase';
import { CreateWorkspaceCommand } from '../use-cases/CreateWorkspace/CreateWorkspaceCommand';
import { SuspendWorkspaceUseCase } from '../use-cases/SuspendWorkspace/SuspendWorkspaceUseCase';
import { SuspendWorkspaceCommand } from '../use-cases/SuspendWorkspace/SuspendWorkspaceCommand';
import { ActivateWorkspaceUseCase } from '../use-cases/ActivateWorkspace/ActivateWorkspaceUseCase';
import { ActivateWorkspaceCommand } from '../use-cases/ActivateWorkspace/ActivateWorkspaceCommand';
import { ArchiveWorkspaceUseCase } from '../use-cases/ArchiveWorkspace/ArchiveWorkspaceUseCase';
import { ArchiveWorkspaceCommand } from '../use-cases/ArchiveWorkspace/ArchiveWorkspaceCommand';
import { UpdateWorkspaceSettingsUseCase } from '../use-cases/UpdateWorkspaceSettings/UpdateWorkspaceSettingsUseCase';
import { UpdateWorkspaceSettingsCommand } from '../use-cases/UpdateWorkspaceSettings/UpdateWorkspaceSettingsCommand';

import { Workspace } from '../../domain/aggregates/Workspace';
import { WorkspaceId } from '../../domain/value-objects/WorkspaceId';
import { WorkspaceStatus } from '../../domain/enums/WorkspaceStatus';
import { ApplicationException } from '@rrss-auto/application';

import {
  FakeWorkspaceRepository,
  FakeEventBus,
  FakeIdentifierProvider,
  WorkspaceBuilder
} from '@rrss-auto/testing';

import { WorkspaceCreated } from '../../domain/domain-events/WorkspaceCreated';
import { WorkspaceSuspended } from '../../domain/domain-events/WorkspaceSuspended';
import { WorkspaceActivated } from '../../domain/domain-events/WorkspaceActivated';
import { WorkspaceArchived } from '../../domain/domain-events/WorkspaceArchived';
import { WorkspaceSettingsUpdated } from '../../domain/domain-events/WorkspaceSettingsUpdated';

describe('Workspace Use Cases', () => {
  let workspaceRepository: FakeWorkspaceRepository;
  let eventBus: FakeEventBus;
  let identifierProvider: FakeIdentifierProvider;
  let createdWorkspace: Workspace;

  beforeEach(async () => {
    workspaceRepository = new FakeWorkspaceRepository();
    eventBus = new FakeEventBus();
    identifierProvider = new FakeIdentifierProvider();

    // Use WorkspaceBuilder to construct a helper workspace and save it to the fake repository
    createdWorkspace = WorkspaceBuilder.create()
      .withId('wksp-123')
      .withName('Acme Corp')
      .withSlug('acme-corp')
      .withTimezone('UTC')
      .withLocale('en-US')
      .withOwnerId('usr-123')
      .withLimits({ maxBusinesses: 1, maxConcurrentExecutions: 1, maxProxies: 1, maxVms: 1 })
      .build();

    await workspaceRepository.save(createdWorkspace);
  });

  describe('CreateWorkspaceUseCase', () => {
    it('should create a workspace successfully', async () => {
      identifierProvider.setNextId('wksp-999');

      const useCase = new CreateWorkspaceUseCase(workspaceRepository, eventBus, identifierProvider);
      
      const command = new CreateWorkspaceCommand(
        'New Corp',
        'new-corp',
        'America/New_York',
        'en-US',
        'usr-999',
        { maxBusinesses: 1, maxConcurrentExecutions: 2, maxProxies: 3, maxVms: 4 }
      );

      const id = await useCase.execute(command);

      expect(id).toBe('wksp-999');
      
      const savedWorkspace = await workspaceRepository.findById(WorkspaceId.create('wksp-999'));
      expect(savedWorkspace).not.toBeNull();
      expect(savedWorkspace!.id.value).toBe('wksp-999');
      expect(savedWorkspace!.status).toBe(WorkspaceStatus.CreationRequested);
      
      eventBus.assertPublishedTimes(WorkspaceCreated, 1);
      const events = eventBus.getPublishedEvents();
      expect(events[0]).toBeInstanceOf(WorkspaceCreated);
    });

    it('should throw if workspace name already exists', async () => {
      const useCase = new CreateWorkspaceUseCase(workspaceRepository, eventBus, identifierProvider);
      const command = new CreateWorkspaceCommand(
        'Acme Corp', // Existing name
        'acme-corp-2', 
        'UTC', 
        'en', 
        'usr', 
        { maxBusinesses: 1, maxConcurrentExecutions: 1, maxProxies: 1, maxVms: 1 }
      );

      await expect(useCase.execute(command)).rejects.toThrow(ApplicationException);
    });
  });

  describe('SuspendWorkspaceUseCase', () => {
    it('should suspend a workspace successfully', async () => {
      createdWorkspace.activate();
      createdWorkspace.clearDomainEvents();
      // Resave to keep repo in sync with mutated entity
      await workspaceRepository.save(createdWorkspace);

      const useCase = new SuspendWorkspaceUseCase(workspaceRepository, eventBus);
      await useCase.execute(new SuspendWorkspaceCommand('wksp-123'));

      const saved = await workspaceRepository.findById(createdWorkspace.id);
      expect(saved!.status).toBe(WorkspaceStatus.Suspended);
      eventBus.assertPublished(WorkspaceSuspended);
    });

    it('should throw if workspace not found', async () => {
      const useCase = new SuspendWorkspaceUseCase(workspaceRepository, eventBus);
      await expect(useCase.execute(new SuspendWorkspaceCommand('wksp-non-existent'))).rejects.toThrow(ApplicationException);
    });
  });

  describe('ActivateWorkspaceUseCase', () => {
    it('should activate a workspace successfully', async () => {
      // currently CreationRequested in repo
      const useCase = new ActivateWorkspaceUseCase(workspaceRepository, eventBus);
      await useCase.execute(new ActivateWorkspaceCommand('wksp-123'));

      const saved = await workspaceRepository.findById(createdWorkspace.id);
      expect(saved!.status).toBe(WorkspaceStatus.Active);
      eventBus.assertPublished(WorkspaceActivated);
    });
  });

  describe('ArchiveWorkspaceUseCase', () => {
    it('should archive a workspace successfully', async () => {
      createdWorkspace.activate();
      createdWorkspace.clearDomainEvents();
      await workspaceRepository.save(createdWorkspace);

      const useCase = new ArchiveWorkspaceUseCase(workspaceRepository, eventBus);
      await useCase.execute(new ArchiveWorkspaceCommand('wksp-123'));

      const saved = await workspaceRepository.findById(createdWorkspace.id);
      expect(saved!.status).toBe(WorkspaceStatus.Archived);
      eventBus.assertPublished(WorkspaceArchived);
    });
  });

  describe('UpdateWorkspaceSettingsUseCase', () => {
    it('should update settings successfully', async () => {
      createdWorkspace.activate();
      createdWorkspace.clearDomainEvents();
      await workspaceRepository.save(createdWorkspace);

      const useCase = new UpdateWorkspaceSettingsUseCase(workspaceRepository, eventBus);
      await useCase.execute(new UpdateWorkspaceSettingsCommand('wksp-123', 'Europe/London', 'en-GB'));

      const saved = await workspaceRepository.findById(createdWorkspace.id);
      expect(saved!.settings.timezone.value).toBe('Europe/London');
      expect(saved!.settings.locale).toBe('en-GB');
      eventBus.assertPublished(WorkspaceSettingsUpdated);
    });
  });
});
