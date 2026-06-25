import { Module } from '@nestjs/common';
import { ExecutionInfrastructureModule } from './infrastructure/ExecutionInfrastructureModule';

@Module({
  imports: [ExecutionInfrastructureModule],
  exports: [ExecutionInfrastructureModule],
})
export class ExecutionModule {}
