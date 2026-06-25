import { PluginManifest } from '@rrss-auto/plugin-sdk';

export const BrowserManifest: PluginManifest = {
  id: 'browser-foundation',
  name: 'Browser Automation Foundation',
  version: '1.0.0',
  description: 'Generic base interfaces for all browser drivers',
  metadata: {
    author: 'RRSS AUTO',
    license: 'MIT'
  },
  capabilities: [],
  settingsSchema: {
    type: 'object',
    properties: {
      headless: { type: 'boolean' }
    }
  }
};
