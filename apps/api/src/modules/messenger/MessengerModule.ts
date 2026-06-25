import { Module } from '@nestjs/common';
import { MessengerController } from './presentation/http/MessengerController';
import { MessengerWebhookController } from './presentation/http/MessengerWebhookController';

@Module({
  controllers: [MessengerController, MessengerWebhookController],
  providers: [],
})
export class MessengerModule {}
