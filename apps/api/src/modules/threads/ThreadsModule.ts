import { Module } from '@nestjs/common';
import { ThreadsController } from './presentation/http/ThreadsController';

@Module({
  controllers: [ThreadsController],
  providers: [],
})
export class ThreadsModule {}
