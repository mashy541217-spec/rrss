import { PluginManifest, PluginCapability } from '@rrss-auto/plugin-sdk';
import { MessagingManifest } from '@rrss-auto/messaging-sdk';

export const MessengerManifest: MessagingManifest = {
  id: 'messenger',
  name: 'Messenger Provider',
  version: '1.0.0',
  description: 'Reference implementation of Messenger using Messaging SDK and Meta Graph API',
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
      pageToken: { type: 'string' },
      pageId: { type: 'string' },
      appSecret: { type: 'string' }
    },
    required: ['pageToken', 'pageId']
  }
};
