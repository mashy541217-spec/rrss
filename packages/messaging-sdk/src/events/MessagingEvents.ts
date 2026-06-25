import { Message, Reaction } from '../models/Message';
import { CallbackQuery } from '../models/Interactive';

export interface MessagingEvent {
  type: string;
  providerId: string;
  timestamp: Date;
}

export interface MessageReceivedEvent extends MessagingEvent {
  type: 'MessageReceived';
  message: Message;
}

export interface MessageSentEvent extends MessagingEvent {
  type: 'MessageSent';
  message: Message;
}

export interface MessageEditedEvent extends MessagingEvent {
  type: 'MessageEdited';
  message: Message;
}

export interface MessageDeletedEvent extends MessagingEvent {
  type: 'MessageDeleted';
  messageId: string;
  conversationId: string;
}

export interface ReactionAddedEvent extends MessagingEvent {
  type: 'ReactionAdded';
  reaction: Reaction;
}

export interface MemberJoinedEvent extends MessagingEvent {
  type: 'MemberJoined';
  conversationId: string;
  memberId: string;
}

export interface MemberLeftEvent extends MessagingEvent {
  type: 'MemberLeft';
  conversationId: string;
  memberId: string;
}

export interface BotStartedEvent extends MessagingEvent {
  type: 'BotStarted';
  conversationId: string;
  userId: string;
}

export interface CallbackQueryReceivedEvent extends MessagingEvent {
  type: 'CallbackQueryReceived';
  query: CallbackQuery;
}
