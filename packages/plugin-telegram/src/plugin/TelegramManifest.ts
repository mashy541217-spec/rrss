import { PluginManifest, PluginCapability } from '@rrss-auto/plugin-sdk';
import { MessagingManifest } from '@rrss-auto/messaging-sdk';

export const TelegramManifest: MessagingManifest = {
  id: 'telegram',
  name: 'Telegram Provider',
  version: '1.0.0',
  description: 'Reference implementation of Telegram Provider using Messaging SDK',
  metadata: {
    author: 'RRSS AUTO',
    license: 'MIT'
  },
  capabilities: [
    PluginCapability.Publishing,
    PluginCapability.Analytics // If applied
  ],
  settingsSchema: {
    type: 'object',
    properties: {
      botToken: { type: 'string' },
      webhookSecret: { type: 'string' }
    },
    required: ['botToken']
  }
};
