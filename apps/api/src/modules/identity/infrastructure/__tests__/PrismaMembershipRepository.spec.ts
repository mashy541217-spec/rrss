import { PrismaService } from '../../../../infrastructure/database/prisma/PrismaService';
import { PrismaMembershipRepository } from '../database/repositories/PrismaMembershipRepository';
import { MembershipMapper } from '../database/mappers/MembershipMapper';
import { MembershipId } from '../../domain/value-objects/MembershipId';
import { UserId } from '../../domain/value-objects/UserId';
import { WorkspaceRef } from '../../domain/value-objects/WorkspaceRef';

describe('PrismaMembershipRepository', () => {
  let repository: PrismaMembershipRepository;
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = {
      $transaction: jest.fn().mockImplementation(async (cb: any) => {
        return cb({
          membership: {
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
      membership: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
      }
    } as any;

    const mapper = new MembershipMapper();
    repository = new PrismaMembershipRepository(prisma, mapper);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should find a membership by ID', async () => {
    const mockModel = {
      id: 'm-1',
      userId: 'u-1',
      workspaceRef: 'w-1',
      roleId: 'r-1',
      status: 'Accepted',
      version: 1,
      isDeleted: false,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    (prisma.membership.findFirst as jest.Mock).mockResolvedValue(mockModel);

    const result = await repository.findById(MembershipId.create('m-1'));

    expect(result).toBeDefined();
    expect(result?.userId.value).toBe('u-1');
  });

  it('should find all memberships by workspace', async () => {
    const mockModel = {
      id: 'm-1',
      userId: 'u-1',
      workspaceRef: 'w-1',
      roleId: 'r-1',
      status: 'Accepted',
      version: 1,
      isDeleted: false,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    (prisma.membership.findMany as jest.Mock).mockResolvedValue([mockModel]);

    const result = await repository.findAllByWorkspace(WorkspaceRef.create('w-1'));

    expect(result.length).toBe(1);
    expect(result[0].id.value).toBe('m-1');
  });
});
