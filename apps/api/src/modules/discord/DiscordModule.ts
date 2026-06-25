import { Module } from '@nestjs/common';
import { DiscordController } from './presentation/http/DiscordController';
import { DiscordWebhookController } from './presentation/http/DiscordWebhookController';

@Module({
  controllers: [DiscordController, DiscordWebhookController],
  providers: [],
})
export class DiscordModule {}
