export interface ReadMessagesInput {
  readonly conversationId: string;
  readonly limit?: number;
}

export interface MessageEntry {
  readonly messageId: string;
  readonly senderId: string;
  readonly text: string;
  readonly timestamp: Date;
}

export interface ReadMessagesOutput {
  readonly success: boolean;
  readonly messages: MessageEntry[];
}
