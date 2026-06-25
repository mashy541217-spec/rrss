import { MessagingProvider, SendMessageOptions, SendMediaOptions } from '../operations/MessagingProvider';
import { Message, MediaMessage, TextMessage } from '../models/Message';
import { Conversation, Participant } from '../models/Conversation';
import { EventEmitter } from 'events';

export class FakeMessagingProvider extends EventEmitter implements MessagingProvider {
  readonly providerId = 'fake-messaging';
  public messages: Message[] = [];
  public conversations: Conversation[] = [];

  public async authenticate(credentials: Record<string, any>): Promise<any> {
    if (!credentials.token) throw new Error('Unauthorized');
    return { token: credentials.token, valid: true };
  }

  public async validateConnection(credentials: Record<string, any>): Promise<boolean> {
    return !!credentials.token;
  }

  public async sendMessage(conversationId: string, text: string, options?: SendMessageOptions): Promise<Message> {
    const msg: TextMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: 'me',
      timestamp: new Date(),
      type: 'TEXT',
      text
    };
    this.messages.push(msg);
    return msg;
  }

  public async editMessage(conversationId: string, messageId: string, text: string): Promise<Message> {
    const msg = this.messages.find(m => m.id === messageId) as TextMessage;
    if (msg) msg.text = text;
    return msg;
  }

  public async deleteMessage(conversationId: string, messageId: string): Promise<boolean> {
    const idx = this.messages.findIndex(m => m.id === messageId);
    if (idx >= 0) {
      this.messages.splice(idx, 1);
      return true;
    }
    return false;
  }

  public async sendMedia(conversationId: string, mediaUrl: string, type: MediaMessage['mediaType'], options?: SendMediaOptions): Promise<MediaMessage> {
    const msg: MediaMessage = {
      id: `media-${Date.now()}`,
      conversationId,
      senderId: 'me',
      timestamp: new Date(),
      type: 'MEDIA',
      mediaType: type,
      mediaUrl,
      caption: options?.caption
    };
    this.messages.push(msg);
    return msg;
  }

  public async getConversations(): Promise<Conversation[]> {
    return this.conversations;
  }

  public async getParticipants(conversationId: string): Promise<Participant[]> {
    return [{ id: 'user-1', role: 'MEMBER' }];
  }

  public async pinMessage(conversationId: string, messageId: string): Promise<boolean> {
    return true;
  }

  public async reactToMessage(conversationId: string, messageId: string, emoji: string): Promise<boolean> {
    return true;
  }
}
