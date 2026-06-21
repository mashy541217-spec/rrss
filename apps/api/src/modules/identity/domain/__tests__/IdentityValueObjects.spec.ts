import { UserId } from '../value-objects/UserId';
import { Email } from '../value-objects/Email';
import { DisplayName } from '../value-objects/DisplayName';
import { PasswordHash } from '../value-objects/PasswordHash';
import { MembershipId } from '../value-objects/MembershipId';
import { WorkspaceRoleId } from '../value-objects/WorkspaceRoleId';
import { InvitationId } from '../value-objects/InvitationId';
import { Permission } from '../value-objects/Permission';
import { InvitationToken } from '../value-objects/InvitationToken';
import { WorkspaceRef } from '../value-objects/WorkspaceRef';

import { InvalidUserIdException } from '../exceptions/InvalidUserIdException';
import { InvalidEmailException } from '../exceptions/InvalidEmailException';
import { InvalidDisplayNameException } from '../exceptions/InvalidDisplayNameException';
import { InvalidPasswordHashException } from '../exceptions/InvalidPasswordHashException';
import { InvalidMembershipIdException } from '../exceptions/InvalidMembershipIdException';
import { InvalidWorkspaceRoleIdException } from '../exceptions/InvalidWorkspaceRoleIdException';
import { InvalidInvitationIdException } from '../exceptions/InvalidInvitationIdException';
import { InvalidPermissionIdentifierException } from '../exceptions/InvalidPermissionIdentifierException';
import { InvalidInvitationTokenException } from '../exceptions/InvalidInvitationTokenException';

describe('Identity Value Objects', () => {
  describe('UserId', () => {
    it('should create valid id', () => {
      const id = UserId.create('usr-123');
      expect(id.value).toBe('usr-123');
    });

    it('should throw on empty id', () => {
      expect(() => UserId.create('')).toThrow(InvalidUserIdException);
      expect(() => UserId.create('   ')).toThrow(InvalidUserIdException);
    });
  });

  describe('Email', () => {
    it('should create valid email and normalize it to lowercase', () => {
      const email = Email.create('Test@Example.COM');
      expect(email.value).toBe('test@example.com');
    });

    it('should throw on invalid format', () => {
      expect(() => Email.create('invalid')).toThrow(InvalidEmailException);
      expect(() => Email.create('invalid@')).toThrow(InvalidEmailException);
      expect(() => Email.create('@domain.com')).toThrow(InvalidEmailException);
      expect(() => Email.create('')).toThrow(InvalidEmailException);
    });
  });

  describe('DisplayName', () => {
    it('should create valid display name and trim whitespace', () => {
      const dn = DisplayName.create('  John Doe  ');
      expect(dn.value).toBe('John Doe');
    });

    it('should throw on empty display name', () => {
      expect(() => DisplayName.create('')).toThrow(InvalidDisplayNameException);
      expect(() => DisplayName.create('   ')).toThrow(InvalidDisplayNameException);
    });

    it('should throw on too long display name', () => {
      const longName = 'a'.repeat(101);
      expect(() => DisplayName.create(longName)).toThrow(InvalidDisplayNameException);
    });
  });

  describe('PasswordHash', () => {
    it('should create valid password hash', () => {
      const hash = PasswordHash.create('somehashhere');
      expect(hash.value).toBe('somehashhere');
    });

    it('should throw on empty password hash', () => {
      expect(() => PasswordHash.create('')).toThrow(InvalidPasswordHashException);
      expect(() => PasswordHash.create('  ')).toThrow(InvalidPasswordHashException);
    });
  });

  describe('MembershipId', () => {
    it('should create valid membership id', () => {
      const id = MembershipId.create('memb-123');
      expect(id.value).toBe('memb-123');
    });

    it('should throw on empty id', () => {
      expect(() => MembershipId.create('')).toThrow(InvalidMembershipIdException);
    });
  });

  describe('WorkspaceRoleId', () => {
    it('should create valid workspace role id', () => {
      const id = WorkspaceRoleId.create('role-123');
      expect(id.value).toBe('role-123');
    });

    it('should throw on empty id', () => {
      expect(() => WorkspaceRoleId.create('')).toThrow(InvalidWorkspaceRoleIdException);
    });
  });

  describe('InvitationId', () => {
    it('should create valid invitation id', () => {
      const id = InvitationId.create('inv-123');
      expect(id.value).toBe('inv-123');
    });

    it('should throw on empty id', () => {
      expect(() => InvitationId.create('')).toThrow(InvalidInvitationIdException);
    });
  });

  describe('Permission', () => {
    it('should create valid permission', () => {
      const perm = Permission.create('workspace.create');
      expect(perm.identifier).toBe('workspace.create');
      expect(perm.resource).toBe('workspace');
      expect(perm.action).toBe('create');
    });

    it('should create multi-segment permission', () => {
      const perm = Permission.create('workspace.settings.update');
      expect(perm.identifier).toBe('workspace.settings.update');
      expect(perm.resource).toBe('workspace.settings');
      expect(perm.action).toBe('update');
    });

    it('should throw on invalid formats', () => {
      expect(() => Permission.create('')).toThrow(InvalidPermissionIdentifierException);
      expect(() => Permission.create('workspace')).toThrow(InvalidPermissionIdentifierException);
      expect(() => Permission.create('workspace.')).toThrow(InvalidPermissionIdentifierException);
      expect(() => Permission.create('.create')).toThrow(InvalidPermissionIdentifierException);
      expect(() => Permission.create('workspace_create')).toThrow(InvalidPermissionIdentifierException);
    });
  });

  describe('InvitationToken', () => {
    it('should create valid token', () => {
      const token = InvitationToken.create('token-123456789012');
      expect(token.value).toBe('token-123456789012');
    });

    it('should throw on empty token', () => {
      expect(() => InvitationToken.create('')).toThrow(InvalidInvitationTokenException);
    });
  });

  describe('WorkspaceRef', () => {
    it('should create valid workspace reference', () => {
      const ref = WorkspaceRef.create('wksp-123');
      expect(ref.value).toBe('wksp-123');
    });

    it('should throw on empty reference', () => {
      expect(() => WorkspaceRef.create('')).toThrow('WorkspaceRef: workspace ID cannot be empty');
    });
  });
});
