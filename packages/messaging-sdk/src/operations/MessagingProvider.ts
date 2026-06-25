import { Message, MediaMessage } from '../models/Message';
import { Conversation, Participant } from '../models/Conversation';
import { InlineKeyboard, ReplyKeyboard } from '../models/Interactive';

export interface SendMessageOptions {
  replyToMessageId?: string;
  inlineKeyboard?: InlineKeyboard;
  replyKeyboard?: ReplyKeyboard;
  disableNotification?: boolean;
}

export interface SendMediaOptions extends SendMessageOptions {
  caption?: string;
}

export interface MessagingProvider {
  readonly providerId: string;
  
  // Auth & Connection
  authenticate(credentials: Record<string, any>): Promise<any>;
  validateConnection(credentials: Record<string, any>): Promise<boolean>;

  // Messaging
  sendMessage(conversationId: string, text: string, options?: SendMessageOptions, credentials?: Record<string, any>): Promise<Message>;
  editMessage(conversationId: string, messageId: string, text: string, options?: SendMessageOptions, credentials?: Record<string, any>): Promise<Message>;
  deleteMessage(conversationId: string, messageId: string, credentials?: Record<string, any>): Promise<boolean>;
  sendMedia(conversationId: string, mediaUrl: string, type: MediaMessage['mediaType'], options?: SendMediaOptions, credentials?: Record<string, any>): Promise<MediaMessage>;

  // Conversations
  getConversations(credentials?: Record<string, any>): Promise<Conversation[]>;
  getParticipants(conversationId: string, credentials?: Record<string, any>): Promise<Participant[]>;
  
  // Interactive / Engagement
  pinMessage(conversationId: string, messageId: string, credentials?: Record<string, any>): Promise<boolean>;
  reactToMessage(conversationId: string, messageId: string, emoji: string, credentials?: Record<string, any>): Promise<boolean>;
}
