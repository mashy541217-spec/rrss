import { PluginManifest } from '@rrss-auto/plugin-sdk';

export const DealerNetManifest: PluginManifest = {
  id: 'dealernet',
  name: 'DealerNet Enterprise Plugin',
  version: '1.0.0',
  description: 'Automates DealerNet business workflows via Browser SDK',
  metadata: {
    author: 'RRSS AUTO',
    license: 'MIT'
  },
  capabilities: [
    'DealerNet' as any
  ],
  settingsSchema: {
    type: 'object',
    properties: {
      baseUrl: { type: 'string', default: 'https://dealernet.internal.enterprise' }
    }
  }
};
