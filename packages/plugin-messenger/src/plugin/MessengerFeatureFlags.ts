import { MessagingFeatureFlags } from '@rrss-auto/messaging-sdk';

export const MessengerFeatureFlags: MessagingFeatureFlags = {
  SupportsMedia: true,
  SupportsVoice: true,
  SupportsVideo: true,
  SupportsButtons: true, // Quick Replies & Templates
  SupportsReplies: true,
  SupportsReactions: true,
  SupportsThreads: false, 
  SupportsCommands: false, 
  SupportsWebhooks: true
};
