import { RegisterUserUseCase } from '../use-cases/RegisterUser/RegisterUserUseCase';
import { RegisterUserCommand } from '../use-cases/RegisterUser/RegisterUserCommand';
import { VerifyUserUseCase } from '../use-cases/VerifyUser/VerifyUserUseCase';
import { VerifyUserCommand } from '../use-cases/VerifyUser/VerifyUserCommand';
import { SuspendUserUseCase } from '../use-cases/SuspendUser/SuspendUserUseCase';
import { SuspendUserCommand } from '../use-cases/SuspendUser/SuspendUserCommand';
import { CreateWorkspaceRoleUseCase } from '../use-cases/CreateWorkspaceRole/CreateWorkspaceRoleUseCase';
import { CreateWorkspaceRoleCommand } from '../use-cases/CreateWorkspaceRole/CreateWorkspaceRoleCommand';
import { GrantPermissionToRoleUseCase } from '../use-cases/GrantPermissionToRole/GrantPermissionToRoleUseCase';
import { GrantPermissionToRoleCommand } from '../use-cases/GrantPermissionToRole/GrantPermissionToRoleCommand';
import { SendInvitationUseCase } from '../use-cases/SendInvitation/SendInvitationUseCase';
import { SendInvitationCommand } from '../use-cases/SendInvitation/SendInvitationCommand';
import { AcceptInvitationUseCase } from '../use-cases/AcceptInvitation/AcceptInvitationUseCase';
import { AcceptInvitationCommand } from '../use-cases/AcceptInvitation/AcceptInvitationCommand';
import { SuspendMembershipUseCase } from '../use-cases/SuspendMembership/SuspendMembershipUseCase';
import { SuspendMembershipCommand } from '../use-cases/SuspendMembership/SuspendMembershipCommand';

import { User } from '../../domain/aggregates/User';
import { WorkspaceRole } from '../../domain/aggregates/WorkspaceRole';
import { Membership } from '../../domain/aggregates/Membership';
import { Invitation } from '../../domain/aggregates/Invitation';

import { UserId } from '../../domain/value-objects/UserId';
import { WorkspaceRoleId } from '../../domain/value-objects/WorkspaceRoleId';
import { MembershipId } from '../../domain/value-objects/MembershipId';
import { InvitationId } from '../../domain/value-objects/InvitationId';
import { UserStatus } from '../../domain/enums/UserStatus';
import { WorkspaceRoleStatus } from '../../domain/enums/WorkspaceRoleStatus';
import { MembershipStatus } from '../../domain/enums/MembershipStatus';
import { InvitationStatus } from '../../domain/enums/InvitationStatus';

import {
  FakeUserRepository,
  FakeWorkspaceRoleRepository,
  FakeMembershipRepository,
  FakeInvitationRepository,
  FakeEventBus,
  FakeIdentifierProvider,
  UserBuilder,
  WorkspaceRoleBuilder,
  MembershipBuilder,
  InvitationBuilder,
} from '@rrss-auto/testing';

import { UserRegistered } from '../../domain/domain-events/UserRegistered';
import { UserVerified } from '../../domain/domain-events/UserVerified';
import { UserSuspended } from '../../domain/domain-events/UserSuspended';
import { WorkspaceRoleCreated } from '../../domain/domain-events/WorkspaceRoleCreated';
import { PermissionGrantedToRole } from '../../domain/domain-events/PermissionGrantedToRole';
import { InvitationSent } from '../../domain/domain-events/InvitationSent';
import { InvitationAccepted } from '../../domain/domain-events/InvitationAccepted';
import { MembershipCreated } from '../../domain/domain-events/MembershipCreated';
import { MembershipAccepted } from '../../domain/domain-events/MembershipAccepted';
import { MembershipSuspended } from '../../domain/domain-events/MembershipSuspended';

import { ApplicationException } from '@rrss-auto/application';
import { UserEmailAlreadyExistsException } from '../../domain/exceptions/UserEmailAlreadyExistsException';
import { UserNotFoundException } from '../../domain/exceptions/UserNotFoundException';
import { WorkspaceRoleNotFoundException } from '../../domain/exceptions/WorkspaceRoleNotFoundException';
import { InvitationNotFoundException } from '../../domain/exceptions/InvitationNotFoundException';
import { MembershipNotFoundException } from '../../domain/exceptions/MembershipNotFoundException';

describe('Identity Use Cases', () => {
  let userRepository: FakeUserRepository;
  let roleRepository: FakeWorkspaceRoleRepository;
  let membershipRepository: FakeMembershipRepository;
  let invitationRepository: FakeInvitationRepository;
  let eventBus: FakeEventBus;
  let identifierProvider: FakeIdentifierProvider;

  beforeEach(() => {
    userRepository = new FakeUserRepository();
    roleRepository = new FakeWorkspaceRoleRepository();
    membershipRepository = new FakeMembershipRepository();
    invitationRepository = new FakeInvitationRepository();
    eventBus = new FakeEventBus();
    identifierProvider = new FakeIdentifierProvider();
  });

  describe('RegisterUserUseCase', () => {
    it('should register a user successfully', async () => {
      identifierProvider.setNextId('usr-111');
      const useCase = new RegisterUserUseCase(userRepository, eventBus, identifierProvider);

      const command = new RegisterUserCommand('john@example.com', 'John Doe', 'hashed-pass');
      const id = await useCase.execute(command);

      expect(id).toBe('usr-111');
      const savedUser = await userRepository.findById(UserId.create('usr-111'));
      expect(savedUser).not.toBeNull();
      expect(savedUser!.email.value).toBe('john@example.com');
      expect(savedUser!.status).toBe(UserStatus.PendingVerification);

      eventBus.assertPublished(UserRegistered);
    });

    it('should throw UserEmailAlreadyExistsException if email already registered', async () => {
      const existingUser = UserBuilder.create().withEmail('john@example.com').build();
      await userRepository.save(existingUser);

      const useCase = new RegisterUserUseCase(userRepository, eventBus, identifierProvider);
      const command = new RegisterUserCommand('john@example.com', 'John Doe', 'hashed-pass');

      await expect(useCase.execute(command)).rejects.toThrow(UserEmailAlreadyExistsException);
    });
  });

  describe('VerifyUserUseCase', () => {
    it('should verify a user successfully', async () => {
      const user = UserBuilder.create().withId('usr-111').withStatus(UserStatus.PendingVerification).build();
      await userRepository.save(user);

      const useCase = new VerifyUserUseCase(userRepository, eventBus);
      await useCase.execute(new VerifyUserCommand('usr-111'));

      const savedUser = await userRepository.findById(UserId.create('usr-111'));
      expect(savedUser!.status).toBe(UserStatus.Active);
      eventBus.assertPublished(UserVerified);
    });

    it('should throw UserNotFoundException if user does not exist', async () => {
      const useCase = new VerifyUserUseCase(userRepository, eventBus);
      await expect(useCase.execute(new VerifyUserCommand('usr-none'))).rejects.toThrow(UserNotFoundException);
    });
  });

  describe('SuspendUserUseCase', () => {
    it('should suspend a user successfully', async () => {
      const user = UserBuilder.create().withId('usr-111').withStatus(UserStatus.Active).build();
      await userRepository.save(user);

      const useCase = new SuspendUserUseCase(userRepository, eventBus);
      await useCase.execute(new SuspendUserCommand('usr-111', 'spamming'));

      const savedUser = await userRepository.findById(UserId.create('usr-111'));
      expect(savedUser!.status).toBe(UserStatus.Suspended);
      eventBus.assertPublished(UserSuspended);
    });

    it('should throw UserNotFoundException if user does not exist', async () => {
      const useCase = new SuspendUserUseCase(userRepository, eventBus);
      await expect(useCase.execute(new SuspendUserCommand('usr-none', 'reason'))).rejects.toThrow(UserNotFoundException);
    });
  });

  describe('CreateWorkspaceRoleUseCase', () => {
    it('should create workspace role successfully', async () => {
      identifierProvider.setNextId('role-111');
      const useCase = new CreateWorkspaceRoleUseCase(roleRepository, eventBus, identifierProvider);

      const command = new CreateWorkspaceRoleCommand(
        'Editor',
        'Can edit files',
        'wksp-123',
        ['workspace.create', 'workspace.settings.update'],
      );

      const id = await useCase.execute(command);
      expect(id).toBe('role-111');

      const savedRole = await roleRepository.findById(WorkspaceRoleId.create('role-111'));
      expect(savedRole).not.toBeNull();
      expect(savedRole!.name).toBe('Editor');
      expect(savedRole!.workspaceRef.value).toBe('wksp-123');
      expect(savedRole!.permissions).toHaveLength(2);

      eventBus.assertPublished(WorkspaceRoleCreated);
      eventBus.assertPublishedTimes(PermissionGrantedToRole, 2);
    });

    it('should throw ApplicationException if role name already exists in workspace', async () => {
      const existingRole = WorkspaceRoleBuilder.create().withName('Editor').withWorkspaceRef('wksp-123').build();
      await roleRepository.save(existingRole);

      const useCase = new CreateWorkspaceRoleUseCase(roleRepository, eventBus, identifierProvider);
      const command = new CreateWorkspaceRoleCommand('Editor', 'Desc', 'wksp-123');

      await expect(useCase.execute(command)).rejects.toThrow(ApplicationException);
    });
  });

  describe('GrantPermissionToRoleUseCase', () => {
    it('should grant permission successfully', async () => {
      const role = WorkspaceRoleBuilder.create().withId('role-111').build();
      await roleRepository.save(role);

      const useCase = new GrantPermissionToRoleUseCase(roleRepository, eventBus);
      await useCase.execute(new GrantPermissionToRoleCommand('role-111', 'workspace.delete'));

      const savedRole = await roleRepository.findById(WorkspaceRoleId.create('role-111'));
      expect(savedRole!.hasPermission(savedRole!.permissions[0])).toBe(true);
      eventBus.assertPublished(PermissionGrantedToRole);
    });

    it('should throw WorkspaceRoleNotFoundException if role does not exist', async () => {
      const useCase = new GrantPermissionToRoleUseCase(roleRepository, eventBus);
      await expect(useCase.execute(new GrantPermissionToRoleCommand('role-none', 'workspace.delete'))).rejects.toThrow(WorkspaceRoleNotFoundException);
    });
  });

  describe('SendInvitationUseCase', () => {
    const expiresAt = new Date(Date.now() + 3600000);

    it('should send invitation successfully', async () => {
      const role = WorkspaceRoleBuilder.create().withId('role-111').withWorkspaceRef('wksp-123').build();
      await roleRepository.save(role);

      identifierProvider.setNextId('inv-111');
      const useCase = new SendInvitationUseCase(invitationRepository, roleRepository, eventBus, identifierProvider);

      const command = new SendInvitationCommand(
        'invitee@example.com',
        'wksp-123',
        'role-111',
        'token-123456789012',
        expiresAt,
      );

      const id = await useCase.execute(command);
      expect(id).toBe('inv-111');

      const savedInvitation = await invitationRepository.findById(InvitationId.create('inv-111'));
      expect(savedInvitation).not.toBeNull();
      expect(savedInvitation!.email.value).toBe('invitee@example.com');
      expect(savedInvitation!.status).toBe(InvitationStatus.Pending);

      eventBus.assertPublished(InvitationSent);
    });

    it('should throw WorkspaceRoleNotFoundException if role does not exist', async () => {
      const useCase = new SendInvitationUseCase(invitationRepository, roleRepository, eventBus, identifierProvider);
      const command = new SendInvitationCommand('invitee@example.com', 'wksp-123', 'role-none', 'token-123456789012', expiresAt);

      await expect(useCase.execute(command)).rejects.toThrow(WorkspaceRoleNotFoundException);
    });

    it('should throw ApplicationException if role belongs to another workspace', async () => {
      const role = WorkspaceRoleBuilder.create().withId('role-111').withWorkspaceRef('wksp-other').build();
      await roleRepository.save(role);

      const useCase = new SendInvitationUseCase(invitationRepository, roleRepository, eventBus, identifierProvider);
      const command = new SendInvitationCommand('invitee@example.com', 'wksp-123', 'role-111', 'token-123456789012', expiresAt);

      await expect(useCase.execute(command)).rejects.toThrow(ApplicationException);
    });

    it('should throw ApplicationException if pending invitation already exists', async () => {
      const role = WorkspaceRoleBuilder.create().withId('role-111').withWorkspaceRef('wksp-123').build();
      await roleRepository.save(role);

      const existingInvitation = InvitationBuilder.create()
        .withEmail('invitee@example.com')
        .withWorkspaceRef('wksp-123')
        .withStatus(InvitationStatus.Pending)
        .build();
      await invitationRepository.save(existingInvitation);

      const useCase = new SendInvitationUseCase(invitationRepository, roleRepository, eventBus, identifierProvider);
      const command = new SendInvitationCommand('invitee@example.com', 'wksp-123', 'role-111', 'token-123456789012', expiresAt);

      await expect(useCase.execute(command)).rejects.toThrow(ApplicationException);
    });
  });

  describe('AcceptInvitationUseCase', () => {
    it('should accept invitation successfully and create an active membership', async () => {
      const user = UserBuilder.create().withId('usr-111').build();
      await userRepository.save(user);

      const invitation = InvitationBuilder.create()
        .withId('inv-111')
        .withEmail('john@example.com')
        .withWorkspaceRef('wksp-123')
        .withRoleId('role-111')
        .withToken('token-123456789012')
        .withStatus(InvitationStatus.Pending)
        .build();
      await invitationRepository.save(invitation);

      identifierProvider.setNextId('memb-111');
      const useCase = new AcceptInvitationUseCase(
        invitationRepository,
        membershipRepository,
        userRepository,
        eventBus,
        identifierProvider,
      );

      const command = new AcceptInvitationCommand('inv-111', 'token-123456789012', 'usr-111');
      const membershipId = await useCase.execute(command);

      expect(membershipId).toBe('memb-111');

      const savedInvitation = await invitationRepository.findById(InvitationId.create('inv-111'));
      expect(savedInvitation!.status).toBe(InvitationStatus.Accepted);

      const savedMembership = await membershipRepository.findById(MembershipId.create('memb-111'));
      expect(savedMembership).not.toBeNull();
      expect(savedMembership!.userId.value).toBe('usr-111');
      expect(savedMembership!.workspaceRef.value).toBe('wksp-123');
      expect(savedMembership!.roleId.value).toBe('role-111');
      expect(savedMembership!.status).toBe(MembershipStatus.Accepted);

      eventBus.assertPublished(InvitationAccepted);
      eventBus.assertPublished(MembershipCreated);
      eventBus.assertPublished(MembershipAccepted);
    });

    it('should throw UserNotFoundException if user not found', async () => {
      const useCase = new AcceptInvitationUseCase(
        invitationRepository,
        membershipRepository,
        userRepository,
        eventBus,
        identifierProvider,
      );
      const command = new AcceptInvitationCommand('inv-111', 'token-123456789012', 'usr-none');

      await expect(useCase.execute(command)).rejects.toThrow(UserNotFoundException);
    });

    it('should throw InvitationNotFoundException if invitation not found', async () => {
      const user = UserBuilder.create().withId('usr-111').build();
      await userRepository.save(user);

      const useCase = new AcceptInvitationUseCase(
        invitationRepository,
        membershipRepository,
        userRepository,
        eventBus,
        identifierProvider,
      );
      const command = new AcceptInvitationCommand('inv-none', 'token-123456789012', 'usr-111');

      await expect(useCase.execute(command)).rejects.toThrow(InvitationNotFoundException);
    });

    it('should throw ApplicationException if membership already exists', async () => {
      const user = UserBuilder.create().withId('usr-111').build();
      await userRepository.save(user);

      const invitation = InvitationBuilder.create()
        .withId('inv-111')
        .withToken('token-123456789012')
        .withWorkspaceRef('wksp-123')
        .build();
      await invitationRepository.save(invitation);

      const membership = MembershipBuilder.create()
        .withUserId('usr-111')
        .withWorkspaceRef('wksp-123')
        .build();
      await membershipRepository.save(membership);

      const useCase = new AcceptInvitationUseCase(
        invitationRepository,
        membershipRepository,
        userRepository,
        eventBus,
        identifierProvider,
      );
      const command = new AcceptInvitationCommand('inv-111', 'token-123456789012', 'usr-111');

      await expect(useCase.execute(command)).rejects.toThrow(ApplicationException);
    });
  });

  describe('SuspendMembershipUseCase', () => {
    it('should suspend membership successfully', async () => {
      const membership = MembershipBuilder.create().withId('memb-111').withStatus(MembershipStatus.Accepted).build();
      await membershipRepository.save(membership);

      const useCase = new SuspendMembershipUseCase(membershipRepository, eventBus);
      await useCase.execute(new SuspendMembershipCommand('memb-111', 'disciplinary'));

      const saved = await membershipRepository.findById(MembershipId.create('memb-111'));
      expect(saved!.status).toBe(MembershipStatus.Suspended);

      eventBus.assertPublished(MembershipSuspended);
    });

    it('should throw MembershipNotFoundException if membership does not exist', async () => {
      const useCase = new SuspendMembershipUseCase(membershipRepository, eventBus);
      await expect(useCase.execute(new SuspendMembershipCommand('memb-none', 'reason'))).rejects.toThrow(MembershipNotFoundException);
    });
  });
});
