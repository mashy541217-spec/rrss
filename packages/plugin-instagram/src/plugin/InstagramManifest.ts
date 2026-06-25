import { PluginManifest, PluginCapability } from '@rrss-auto/plugin-sdk';

export const InstagramManifest: PluginManifest = {
  id: 'instagram-plugin',
  name: 'Instagram',
  version: '1.0.0',
  description: 'Production-grade Instagram reference integration provider',
  capabilities: [
    PluginCapability.Publishing,
    PluginCapability.Analytics
  ],
  metadata: {
    author: 'RRSS AUTO core team',
    license: 'MIT',
    homepage: 'https://rrss-auto.com/plugins/instagram',
    supportEmail: 'plugins@rrss-auto.com',
    logoUrl: 'https://rrss-auto.com/logos/instagram.svg'
  },
  settingsSchema: {
    type: 'object',
    properties: {
      appId: { type: 'string', description: 'Meta App ID' },
      appSecret: { type: 'string', description: 'Meta App Secret' },
      verifyToken: { type: 'string', description: 'Webhook Verification Token' }
    },
    required: ['appId', 'appSecret']
  }
};
