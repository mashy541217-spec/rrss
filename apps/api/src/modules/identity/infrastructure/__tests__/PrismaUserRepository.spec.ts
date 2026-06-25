import { PrismaService } from '../../../../infrastructure/database/prisma/PrismaService';
import { PrismaUserRepository } from '../database/repositories/PrismaUserRepository';
import { UserMapper } from '../database/mappers/UserMapper';
import { User } from '../../domain/aggregates/User';
import { UserId } from '../../domain/value-objects/UserId';
import { Email } from '../../domain/value-objects/Email';

describe('PrismaUserRepository', () => {
  let repository: PrismaUserRepository;
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = {
      $transaction: jest.fn().mockImplementation(async (cb: any) => {
        return cb({
          user: {
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
      user: {
        findFirst: jest.fn(),
        count: jest.fn(),
      }
    } as any;

    const mapper = new UserMapper();
    repository = new PrismaUserRepository(prisma, mapper);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should find a user by ID', async () => {
    const mockModel = {
      id: 'u-1',
      email: 'test@example.com',
      displayName: 'Test User',
      passwordHash: 'hashedpassword',
      status: 'Active',
      version: 1,
      isDeleted: false,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockModel);

    const result = await repository.findById(UserId.create('u-1'));

    expect(result).toBeDefined();
    expect(result?.email.value).toBe('test@example.com');
  });

  it('should return true if email exists', async () => {
    (prisma.user.count as jest.Mock).mockResolvedValue(1);

    const result = await repository.existsByEmail(Email.create('test@example.com'));

    expect(result).toBe(true);
  });
});
