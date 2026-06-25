import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

// The enterprise module would normally import CQRS handlers, controllers, and register Prisma providers here.
@Module({
  imports: [CqrsModule],
  controllers: [],
  providers: [],
  exports: []
})
export class EnterpriseModule {}
