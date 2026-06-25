import { PrismaService } from '../../../../infrastructure/database/prisma/PrismaService';
import { WorkspacePrismaRepository } from '../database/repositories/WorkspacePrismaRepository';
import { WorkspaceMapper } from '../database/mappers/WorkspaceMapper';
import { Workspace } from '../../domain/aggregates/Workspace';
import { WorkspaceId } from '../../domain/value-objects/WorkspaceId';
import { WorkspaceName } from '../../domain/value-objects/WorkspaceName';

describe('WorkspacePrismaRepository', () => {
  let repository: WorkspacePrismaRepository;
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = {
      $transaction: jest.fn().mockImplementation(async (cb: any) => {
        return cb({
          workspace: {
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
      workspace: {
        findFirst: jest.fn(),
      }
    } as any;

    const mapper = new WorkspaceMapper();
    repository = new WorkspacePrismaRepository(prisma, mapper);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should find a workspace by ID', async () => {
    const mockModel = {
      id: 'w-1',
      name: 'Test Workspace',
      slug: 'test-workspace',
      ownerId: 'u-1',
      status: 'Active',
      settings: { timezone: { value: 'UTC' }, locale: 'en' },
      limits: { maxBusinesses: 1, maxConcurrentExecutions: 1, maxProxies: 0, maxVms: 0 },
      version: 1,
      isDeleted: false,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    (prisma.workspace.findFirst as jest.Mock).mockResolvedValue(mockModel);

    const result = await repository.findById(WorkspaceId.create('w-1'));

    expect(result).toBeDefined();
    expect(result?.name.value).toBe('Test Workspace');
  });
});
