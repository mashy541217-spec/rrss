import { MessagingFeatureFlags } from '@rrss-auto/messaging-sdk';

export const WhatsAppBusinessFeatureFlags: MessagingFeatureFlags = {
  SupportsMedia: true,
  SupportsVoice: true,
  SupportsVideo: true,
  SupportsButtons: true,
  SupportsReplies: true,
  SupportsReactions: true,
  SupportsThreads: false, // WhatsApp doesn't have threads in the Slack/Discord sense natively
  SupportsCommands: false, // Not native Bot commands like Telegram
  SupportsWebhooks: true
};
