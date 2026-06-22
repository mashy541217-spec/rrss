import { Module } from '@nestjs/common';
import { RedisService } from './RedisService';

@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
