import { PluginManifest, PluginCapability } from '@rrss-auto/plugin-sdk';
import { MessagingManifest } from '@rrss-auto/messaging-sdk';

export const WhatsAppBusinessManifest: MessagingManifest = {
  id: 'whatsapp-business',
  name: 'WhatsApp Business Provider',
  version: '1.0.0',
  description: 'Reference implementation of WhatsApp Business using Messaging SDK and Meta Graph API',
  metadata: {
    author: 'RRSS AUTO',
    license: 'MIT'
  },
  capabilities: [
    PluginCapability.Publishing
  ],
  settingsSchema: {
    type: 'object',
    properties: {
      accessToken: { type: 'string' },
      phoneNumberId: { type: 'string' },
      webhookVerifyToken: { type: 'string' }
    },
    required: ['accessToken', 'phoneNumberId']
  }
};
