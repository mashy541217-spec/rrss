import { PluginManifest, PluginCapability } from '@rrss-auto/plugin-sdk';
import { MessagingManifest } from '@rrss-auto/messaging-sdk';

export const SlackManifest: MessagingManifest = {
  id: 'slack',
  name: 'Slack Provider',
  version: '1.0.0',
  description: 'Reference implementation of Slack Enterprise Collaboration Platform using Messaging SDK',
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
      appToken: { type: 'string' },
      signingSecret: { type: 'string' }
    },
    required: ['botToken']
  }
};
