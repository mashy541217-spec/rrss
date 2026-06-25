import { Module } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma/PrismaService';
import { UserMapper } from './database/mappers/UserMapper';
import { MembershipMapper } from './database/mappers/MembershipMapper';
import { WorkspaceRoleMapper } from './database/mappers/WorkspaceRoleMapper';
import { InvitationMapper } from './database/mappers/InvitationMapper';
import { PrismaUserRepository } from './database/repositories/PrismaUserRepository';
import { PrismaMembershipRepository } from './database/repositories/PrismaMembershipRepository';
import { PrismaWorkspaceRoleRepository } from './database/repositories/PrismaWorkspaceRoleRepository';
import { PrismaInvitationRepository } from './database/repositories/PrismaInvitationRepository';

@Module({
  providers: [
    PrismaService,
    UserMapper,
    MembershipMapper,
    WorkspaceRoleMapper,
    InvitationMapper,
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'IMembershipRepository',
      useClass: PrismaMembershipRepository,
    },
    {
      provide: 'IWorkspaceRoleRepository',
      useClass: PrismaWorkspaceRoleRepository,
    },
    {
      provide: 'IInvitationRepository',
      useClass: PrismaInvitationRepository,
    },
  ],
  exports: [
    'IUserRepository',
    'IMembershipRepository',
    'IWorkspaceRoleRepository',
    'IInvitationRepository',
  ],
})
export class IdentityInfrastructureModule {}
