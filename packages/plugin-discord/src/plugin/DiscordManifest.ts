import { PluginManifest, PluginCapability } from '@rrss-auto/plugin-sdk';
import { MessagingManifest } from '@rrss-auto/messaging-sdk';

export const DiscordManifest: MessagingManifest = {
  id: 'discord',
  name: 'Discord Provider',
  version: '1.0.0',
  description: 'Reference implementation of Discord Community Platform using Messaging SDK',
  metadata: {
    author: 'RRSS AUTO',
    license: 'MIT'
  },
  capabilities: [
    PluginCapability.Messaging
  ],
  settingsSchema: {
    type: 'object',
    properties: {
      botToken: { type: 'string' },
      applicationId: { type: 'string' },
      publicKey: { type: 'string' }
    },
    required: ['botToken']
  }
};
