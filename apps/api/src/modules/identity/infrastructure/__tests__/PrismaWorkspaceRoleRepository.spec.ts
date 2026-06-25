import { PrismaService } from '../../../../infrastructure/database/prisma/PrismaService';
import { PrismaWorkspaceRoleRepository } from '../database/repositories/PrismaWorkspaceRoleRepository';
import { WorkspaceRoleMapper } from '../database/mappers/WorkspaceRoleMapper';
import { WorkspaceRoleId } from '../../domain/value-objects/WorkspaceRoleId';
import { WorkspaceRef } from '../../domain/value-objects/WorkspaceRef';

describe('PrismaWorkspaceRoleRepository', () => {
  let repository: PrismaWorkspaceRoleRepository;
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = {
      $transaction: jest.fn().mockImplementation(async (cb: any) => {
        return cb({
          workspaceRole: {
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
      workspaceRole: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
      }
    } as any;

    const mapper = new WorkspaceRoleMapper();
    repository = new PrismaWorkspaceRoleRepository(prisma, mapper);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should find a role by ID', async () => {
    const mockModel = {
      id: 'r-1',
      name: 'Admin',
      description: 'Administrator role',
      workspaceRef: 'w-1',
      permissions: ['workspace.create'],
      status: 'Active',
      version: 1,
      isDeleted: false,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    (prisma.workspaceRole.findFirst as jest.Mock).mockResolvedValue(mockModel);

    const result = await repository.findById(WorkspaceRoleId.create('r-1'));

    expect(result).toBeDefined();
    expect(result?.name).toBe('Admin');
  });

  it('should find a role by name and workspace', async () => {
    const mockModel = {
      id: 'r-1',
      name: 'Admin',
      description: 'Administrator role',
      workspaceRef: 'w-1',
      permissions: ['workspace.create'],
      status: 'Active',
      version: 1,
      isDeleted: false,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    (prisma.workspaceRole.findFirst as jest.Mock).mockResolvedValue(mockModel);

    const result = await repository.findByNameAndWorkspace('Admin', WorkspaceRef.create('w-1'));

    expect(result).toBeDefined();
    expect(result?.name).toBe('Admin');
  });
});
