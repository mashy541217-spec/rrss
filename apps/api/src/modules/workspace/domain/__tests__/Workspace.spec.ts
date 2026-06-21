import { Workspace } from '../aggregates/Workspace';
import { WorkspaceFactory } from '../factories/WorkspaceFactory';
import { WorkspaceId } from '../value-objects/WorkspaceId';
import { WorkspaceName } from '../value-objects/WorkspaceName';
import { WorkspaceSlug } from '../value-objects/WorkspaceSlug';
import { WorkspaceOwnerId } from '../value-objects/WorkspaceOwnerId';
import { WorkspaceSettings } from '../value-objects/WorkspaceSettings';
import { WorkspaceTimezone } from '../value-objects/WorkspaceTimezone';
import { WorkspaceLimits } from '../value-objects/WorkspaceLimits';
import { WorkspaceStatus } from '../enums/WorkspaceStatus';

import { WorkspaceCreated } from '../domain-events/WorkspaceCreated';
import { WorkspaceActivated } from '../domain-events/WorkspaceActivated';
import { WorkspaceSuspended } from '../domain-events/WorkspaceSuspended';
import { WorkspaceArchived } from '../domain-events/WorkspaceArchived';

import { InvalidWorkspaceTransitionException } from '../exceptions/InvalidWorkspaceTransitionException';
import { WorkspaceSuspendedException } from '../exceptions/WorkspaceSuspendedException';
import { WorkspaceArchivedException } from '../exceptions/WorkspaceArchivedException';

describe('Workspace Aggregate Root', () => {
  const defaultId = WorkspaceId.create('wksp-123');
  const defaultName = WorkspaceName.create('Acme Corp');
  const defaultSlug = WorkspaceSlug.create('acme-corp');
  const defaultOwnerId = WorkspaceOwnerId.create('usr-456');
  const defaultSettings = WorkspaceSettings.create(WorkspaceTimezone.create('America/New_York'), 'en-US');
  const defaultLimits = WorkspaceLimits.create({
    maxBusinesses: 1,
    maxConcurrentExecutions: 2,
    maxProxies: 5,
    maxVms: 3
  });

  const createValidWorkspace = () => {
    return WorkspaceFactory.create({
      id: defaultId,
      name: defaultName,
      slug: defaultSlug,
      ownerId: defaultOwnerId,
      settings: defaultSettings,
      limits: defaultLimits
    });
  };

  describe('Creation', () => {
    it('should create a valid workspace in CreationRequested state', () => {
      const workspace = createValidWorkspace();

      expect(workspace.id.value).toBe('wksp-123');
      expect(workspace.name.value).toBe('Acme Corp');
      expect(workspace.status).toBe(WorkspaceStatus.CreationRequested);

      const events = workspace.domainEvents;
      expect(events.length).toBe(1);
      expect(events[0]).toBeInstanceOf(WorkspaceCreated);
      const createdEvent = events[0] as WorkspaceCreated;
      expect(createdEvent.workspaceId).toBe(defaultId);
      expect(createdEvent.name).toBe('Acme Corp');
      expect(createdEvent.ownerId).toBe('usr-456');
    });
  });

  describe('State Transitions', () => {
    it('should allow activation from CreationRequested', () => {
      const workspace = createValidWorkspace();
      workspace.clearDomainEvents();

      workspace.activate();

      expect(workspace.status).toBe(WorkspaceStatus.Active);
      const events = workspace.domainEvents;
      expect(events.length).toBe(1);
      expect(events[0]).toBeInstanceOf(WorkspaceActivated);
    });

    it('should allow suspension from Active', () => {
      const workspace = createValidWorkspace();
      workspace.activate();
      workspace.clearDomainEvents();

      workspace.suspend();

      expect(workspace.status).toBe(WorkspaceStatus.Suspended);
      const events = workspace.domainEvents;
      expect(events.length).toBe(1);
      expect(events[0]).toBeInstanceOf(WorkspaceSuspended);
    });

    it('should allow activation from Suspended', () => {
      const workspace = createValidWorkspace();
      workspace.activate();
      workspace.suspend();
      workspace.clearDomainEvents();

      workspace.activate();

      expect(workspace.status).toBe(WorkspaceStatus.Active);
      const events = workspace.domainEvents;
      expect(events.length).toBe(1);
      expect(events[0]).toBeInstanceOf(WorkspaceActivated);
    });

    it('should throw when suspending from CreationRequested', () => {
      const workspace = createValidWorkspace();
      expect(() => workspace.suspend()).toThrow(InvalidWorkspaceTransitionException);
    });

    it('should allow archiving from any non-archived state', () => {
      const w1 = createValidWorkspace();
      w1.archive();
      expect(w1.status).toBe(WorkspaceStatus.Archived);

      const w2 = createValidWorkspace();
      w2.activate();
      w2.archive();
      expect(w2.status).toBe(WorkspaceStatus.Archived);

      const w3 = createValidWorkspace();
      w3.activate();
      w3.suspend();
      w3.archive();
      expect(w3.status).toBe(WorkspaceStatus.Archived);
    });

    it('should throw on any action if Archived', () => {
      const workspace = createValidWorkspace();
      workspace.archive();

      expect(() => workspace.activate()).toThrow(WorkspaceArchivedException);
      expect(() => workspace.suspend()).toThrow(WorkspaceArchivedException);
      expect(() => workspace.updateSettings(defaultSettings)).toThrow(WorkspaceArchivedException);
      expect(() => workspace.updateLimits(defaultLimits)).toThrow(WorkspaceArchivedException);
    });
    
    it('should throw when mutating if Suspended', () => {
      const workspace = createValidWorkspace();
      workspace.activate();
      workspace.suspend();

      expect(() => workspace.updateSettings(defaultSettings)).toThrow(WorkspaceSuspendedException);
      expect(() => workspace.updateLimits(defaultLimits)).toThrow(WorkspaceSuspendedException);
    });
  });

  describe('Mutations', () => {
    it('should allow updating settings and emit event', () => {
      const workspace = createValidWorkspace();
      workspace.activate();
      workspace.clearDomainEvents();

      const newSettings = WorkspaceSettings.create(WorkspaceTimezone.create('Europe/London'), 'en-GB');
      workspace.updateSettings(newSettings);

      expect(workspace.settings.timezone.value).toBe('Europe/London');
      expect(workspace.settings.locale).toBe('en-GB');
      
      const events = workspace.domainEvents;
      expect(events.length).toBe(1);
      expect(events[0].constructor.name).toBe('WorkspaceSettingsUpdated');
    });

    it('should allow updating limits', () => {
      const workspace = createValidWorkspace();
      workspace.activate();

      const newLimits = WorkspaceLimits.create({
        maxBusinesses: 10,
        maxConcurrentExecutions: 20,
        maxProxies: 50,
        maxVms: 30
      });
      workspace.updateLimits(newLimits);

      expect(workspace.limits.maxBusinesses).toBe(10);
    });
  });
});
