import { PluginManifest, PluginCapability } from '@rrss-auto/plugin-sdk';

export interface MessagingManifest extends PluginManifest {
  capabilities: PluginCapability[]; // Usually extends further if needed
}
