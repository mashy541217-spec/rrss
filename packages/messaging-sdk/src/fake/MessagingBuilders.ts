import { TextMessage } from '../models/Message';

export class MessageBuilder {
  private msg: TextMessage = {
    id: `id-${Date.now()}`,
    conversationId: 'conv-1',
    senderId: 'user-1',
    timestamp: new Date(),
    type: 'TEXT',
    text: ''
  };

  public withText(text: string): this {
    this.msg.text = text;
    return this;
  }

  public withConversation(id: string): this {
    this.msg.conversationId = id;
    return this;
  }

  public build(): TextMessage {
    return this.msg;
  }
}
