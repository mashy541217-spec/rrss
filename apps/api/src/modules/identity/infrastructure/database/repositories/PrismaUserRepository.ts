import { Injectable } from '@nestjs/common';
import { User as PrismaUser } from '@prisma/client';
import { PrismaService } from '../../../../../infrastructure/database/prisma/PrismaService';
import { BasePrismaRepository } from '../../../../../infrastructure/database/repositories/BasePrismaRepository';
import { TransactionScope } from '../../../../../infrastructure/database/uow/TransactionScope';
import { User } from '../../../domain/aggregates/User';
import { UserId } from '../../../domain/value-objects/UserId';
import { Email } from '../../../domain/value-objects/Email';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UserMapper } from '../mappers/UserMapper';
import { ConcurrencyException } from '../../../../../infrastructure/database/traits/OptimisticLock';

@Injectable()
export class PrismaUserRepository 
  extends BasePrismaRepository<User, UserId, PrismaUser> 
  implements IUserRepository 
{
  constructor(
    private readonly prisma: PrismaService,
    mapper: UserMapper
  ) {
    super(mapper, mapper);
  }

  async save(user: User): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const scope = new TransactionScope(tx);
      
      await this.saveWithEvents(user, scope, async (transactionClient, model) => {
        const existing = await transactionClient.user.findUnique({
          where: { id: model.id }
        });

        if (!existing) {
          await transactionClient.user.create({ data: model });
        } else {
          if (existing.version !== model.version) {
            throw new ConcurrencyException('User', model.id);
          }

          const dataToUpdate = {
            ...model,
            version: model.version + 1,
            updatedAt: new Date()
          };

          await transactionClient.user.update({
            where: { id: model.id, version: model.version },
            data: dataToUpdate
          });
          
          (user as any)['_version'] = dataToUpdate.version;
        }
      });
    });
  }

  async findById(id: UserId): Promise<User | null> {
    const model = await this.prisma.user.findFirst({
      where: { 
        id: id.value,
        isDeleted: false 
      }
    });

    if (!model) return null;
    return this.aggregateMapper.toDomain(model);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const model = await this.prisma.user.findFirst({
      where: { 
        email: email.value,
        isDeleted: false 
      }
    });

    if (!model) return null;
    return this.aggregateMapper.toDomain(model);
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { 
        email: email.value,
        isDeleted: false 
      }
    });
    return count > 0;
  }
}
