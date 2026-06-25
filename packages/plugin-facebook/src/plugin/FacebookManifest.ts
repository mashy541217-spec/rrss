import { PluginManifest, PluginCapability } from '@rrss-auto/plugin-sdk';

export const FacebookManifest: PluginManifest = {
  id: 'facebook',
  name: 'Facebook Provider',
  version: '1.0.0',
  description: 'Reference implementation of Facebook Provider using Meta SDK',
  metadata: {
    author: 'RRSS AUTO',
    license: 'MIT'
  },
  capabilities: [
    PluginCapability.Publishing,
    PluginCapability.Analytics
  ],
  settingsSchema: {
    type: 'object',
    properties: {
      appId: { type: 'string' },
      appSecret: { type: 'string' },
      verifyToken: { type: 'string' }
    },
    required: ['appId']
  }
};
