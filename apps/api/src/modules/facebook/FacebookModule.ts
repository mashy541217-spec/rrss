import { Module } from '@nestjs/common';
import { FacebookController } from './presentation/http/FacebookController';

@Module({
  controllers: [FacebookController],
  providers: [],
})
export class FacebookModule {}
