import { MessagingFeatureFlags } from '@rrss-auto/messaging-sdk';

export const DiscordFeatureFlags: MessagingFeatureFlags = {
  SupportsMedia: true,
  SupportsVoice: true,
  SupportsVideo: true,
  SupportsButtons: true, 
  SupportsReplies: true,
  SupportsReactions: true,
  SupportsThreads: true, 
  SupportsCommands: true, // Slash commands
  SupportsWebhooks: true
};
