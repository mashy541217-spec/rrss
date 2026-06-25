import { PrismaService } from '../../../../infrastructure/database/prisma/PrismaService';
import { PrismaInvitationRepository } from '../database/repositories/PrismaInvitationRepository';
import { InvitationMapper } from '../database/mappers/InvitationMapper';
import { InvitationId } from '../../domain/value-objects/InvitationId';
import { Email } from '../../domain/value-objects/Email';
import { WorkspaceRef } from '../../domain/value-objects/WorkspaceRef';

describe('PrismaInvitationRepository', () => {
  let repository: PrismaInvitationRepository;
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = {
      $transaction: jest.fn().mockImplementation(async (cb: any) => {
        return cb({
          invitation: {
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findFirst: jest.fn(),
          },
          outboxMessage: {
            createMany: jest.fn(),
          }
        });
      }),
      invitation: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
      }
    } as any;

    const mapper = new InvitationMapper();
    repository = new PrismaInvitationRepository(prisma, mapper);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should find an invitation by ID', async () => {
    const mockModel = {
      id: 'i-1',
      email: 'invite@example.com',
      workspaceRef: 'w-1',
      roleId: 'r-1',
      token: 'some-valid-token-12345',
      status: 'Pending',
      expiresAt: new Date(Date.now() + 100000),
      version: 1,
      isDeleted: false,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    (prisma.invitation.findFirst as jest.Mock).mockResolvedValue(mockModel);

    const result = await repository.findById(InvitationId.create('i-1'));

    expect(result).toBeDefined();
    expect(result?.email.value).toBe('invite@example.com');
  });

  it('should find pending invitation by email and workspace', async () => {
    const mockModel = {
      id: 'i-1',
      email: 'invite@example.com',
      workspaceRef: 'w-1',
      roleId: 'r-1',
      token: 'some-valid-token-12345',
      status: 'Pending',
      expiresAt: new Date(Date.now() + 100000),
      version: 1,
      isDeleted: false,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    (prisma.invitation.findFirst as jest.Mock).mockResolvedValue(mockModel);

    const result = await repository.findPendingByEmailAndWorkspace(
      Email.create('invite@example.com'), 
      WorkspaceRef.create('w-1')
    );

    expect(result).toBeDefined();
    expect(result?.status).toBe('Pending');
  });
});
