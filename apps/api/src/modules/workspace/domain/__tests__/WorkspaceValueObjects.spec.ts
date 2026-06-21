import { WorkspaceId } from '../value-objects/WorkspaceId';
import { WorkspaceName } from '../value-objects/WorkspaceName';
import { WorkspaceSlug } from '../value-objects/WorkspaceSlug';
import { WorkspaceTimezone } from '../value-objects/WorkspaceTimezone';
import { WorkspaceLimits } from '../value-objects/WorkspaceLimits';
import { WorkspaceSettings } from '../value-objects/WorkspaceSettings';

import { InvalidWorkspaceIdException } from '../exceptions/InvalidWorkspaceIdException';
import { InvalidWorkspaceNameException } from '../exceptions/InvalidWorkspaceNameException';
import { InvalidWorkspaceSlugException } from '../exceptions/InvalidWorkspaceSlugException';
import { InvalidTimezoneException } from '../exceptions/InvalidTimezoneException';

describe('Workspace Value Objects', () => {
  describe('WorkspaceId', () => {
    it('should create valid id', () => {
      const id = WorkspaceId.create('test-123');
      expect(id.value).toBe('test-123');
    });

    it('should throw on empty id', () => {
      expect(() => WorkspaceId.create('')).toThrow(InvalidWorkspaceIdException);
      expect(() => WorkspaceId.create('   ')).toThrow(InvalidWorkspaceIdException);
    });
  });

  describe('WorkspaceName', () => {
    it('should create valid name', () => {
      const name = WorkspaceName.create('Acme Corp');
      expect(name.value).toBe('Acme Corp');
    });

    it('should throw on too short name', () => {
      expect(() => WorkspaceName.create('ab')).toThrow(InvalidWorkspaceNameException);
    });

    it('should throw on empty name', () => {
      expect(() => WorkspaceName.create('')).toThrow(InvalidWorkspaceNameException);
    });
  });

  describe('WorkspaceSlug', () => {
    it('should create valid slug', () => {
      const slug = WorkspaceSlug.create('acme-corp');
      expect(slug.value).toBe('acme-corp');
    });

    it('should throw on invalid characters', () => {
      expect(() => WorkspaceSlug.create('Acme-Corp')).toThrow(InvalidWorkspaceSlugException);
      expect(() => WorkspaceSlug.create('acme corp')).toThrow(InvalidWorkspaceSlugException);
      expect(() => WorkspaceSlug.create('acme_corp')).toThrow(InvalidWorkspaceSlugException);
      expect(() => WorkspaceSlug.create('-acme')).toThrow(InvalidWorkspaceSlugException);
      expect(() => WorkspaceSlug.create('acme-')).toThrow(InvalidWorkspaceSlugException);
    });
  });

  describe('WorkspaceTimezone', () => {
    it('should create valid timezone', () => {
      const tz = WorkspaceTimezone.create('America/New_York');
      expect(tz.value).toBe('America/New_York');
    });

    it('should throw on invalid IANA timezone', () => {
      expect(() => WorkspaceTimezone.create('Invalid/Timezone')).toThrow(InvalidTimezoneException);
    });
  });

  describe('WorkspaceLimits', () => {
    it('should create valid limits', () => {
      const limits = WorkspaceLimits.create({
        maxBusinesses: 1,
        maxConcurrentExecutions: 2,
        maxProxies: 3,
        maxVms: 4
      });
      expect(limits.maxBusinesses).toBe(1);
    });

    it('should throw on negative limits', () => {
      expect(() => WorkspaceLimits.create({
        maxBusinesses: -1,
        maxConcurrentExecutions: 2,
        maxProxies: 3,
        maxVms: 4
      })).toThrow();
    });
  });

  describe('WorkspaceSettings', () => {
    it('should create valid settings', () => {
      const tz = WorkspaceTimezone.create('UTC');
      const settings = WorkspaceSettings.create(tz, 'en-US');
      expect(settings.timezone.value).toBe('UTC');
      expect(settings.locale).toBe('en-US');
    });
  });
});
