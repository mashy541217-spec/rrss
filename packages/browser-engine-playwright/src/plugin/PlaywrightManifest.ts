import { PluginManifest } from '@rrss-auto/plugin-sdk';

export const PlaywrightManifest: PluginManifest = {
  id: 'playwright',
  name: 'Playwright Browser Engine',
  version: '1.0.0',
  description: 'Physical implementation of the Browser Engine SDK wrapping playwright-core',
  metadata: {
    author: 'RRSS AUTO',
    license: 'MIT'
  },
  capabilities: [
    'BrowserEngine' as any
  ],
  settingsSchema: {
    type: 'object',
    properties: {
      executablePath: { type: 'string' },
      headless: { type: 'boolean', default: true },
      mock: { type: 'boolean', default: false }
    }
  }
};
