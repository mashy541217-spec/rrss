import { Injectable } from '@nestjs/common';
import { User as PrismaUser } from '@prisma/client';
import { AggregateMapper } from '../../../../../infrastructure/database/mappers/AggregateMapper';
import { PersistenceMapper } from '../../../../../infrastructure/database/mappers/PersistenceMapper';
import { User } from '../../../domain/aggregates/User';
import { UserId } from '../../../domain/value-objects/UserId';
import { Email } from '../../../domain/value-objects/Email';
import { DisplayName } from '../../../domain/value-objects/DisplayName';
import { PasswordHash } from '../../../domain/value-objects/PasswordHash';
import { UserStatus } from '../../../domain/enums/UserStatus';

@Injectable()
export class UserMapper
  implements
    AggregateMapper<User, UserId, PrismaUser>,
    PersistenceMapper<User, UserId, PrismaUser>
{
  toDomain(model: PrismaUser): User {
    const user = User.initialize(
      {
        email: Email.create(model.email),
        displayName: DisplayName.create(model.displayName),
        passwordHash: PasswordHash.create(model.passwordHash),
        status: model.status as UserStatus,
      },
      UserId.create(model.id)
    );

    // Set version from persistence
    (user as any)['_version'] = model.version;

    user.clearDomainEvents();
    return user;
  }

  toPersistence(aggregate: User): PrismaUser {
    const version = (aggregate as any)['_version'] || 1;
    
    return {
      id: aggregate.id.value,
      email: aggregate.email.value,
      displayName: aggregate.displayName.value,
      passwordHash: aggregate.passwordHash.value,
      status: aggregate.status,
      version: version,
      isDeleted: aggregate.isDeleted,
      deletedAt: aggregate.isDeleted ? new Date() : null,
      createdAt: new Date(), 
      updatedAt: new Date(),
    };
  }
}
