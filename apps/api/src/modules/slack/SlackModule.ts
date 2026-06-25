import { Module } from '@nestjs/common';
import { SlackController } from './presentation/http/SlackController';
import { SlackWebhookController } from './presentation/http/SlackWebhookController';

@Module({
  controllers: [SlackController, SlackWebhookController],
  providers: [],
})
export class SlackModule {}
