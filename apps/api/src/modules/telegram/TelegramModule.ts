import { Module } from '@nestjs/common';
import { TelegramController } from './presentation/http/TelegramController';

@Module({
  controllers: [TelegramController],
  providers: [],
})
export class TelegramModule {}
