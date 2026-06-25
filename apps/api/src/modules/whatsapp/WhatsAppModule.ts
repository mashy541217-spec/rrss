import { Module } from '@nestjs/common';
import { WhatsAppController } from './presentation/http/WhatsAppController';
import { WhatsAppWebhookController } from './presentation/http/WhatsAppWebhookController';

@Module({
  controllers: [WhatsAppController, WhatsAppWebhookController],
  providers: [],
})
export class WhatsAppModule {}
