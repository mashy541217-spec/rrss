export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  timestamp: Date;
  type: 'TEXT' | 'MARKDOWN' | 'MEDIA' | 'LOCATION' | 'CONTACT';
}

export interface TextMessage extends Message {
  type: 'TEXT';
  text: string;
}

export interface MarkdownMessage extends Message {
  type: 'MARKDOWN';
  markdown: string;
}

export interface MediaMessage extends Message {
  type: 'MEDIA';
  mediaType: 'PHOTO' | 'VIDEO' | 'AUDIO' | 'DOCUMENT' | 'VOICE' | 'STICKER';
  mediaUrl?: string;
  mediaId?: string;
  caption?: string;
  mimeType?: string;
  sizeBytes?: number;
}

export interface LocationMessage extends Message {
  type: 'LOCATION';
  latitude: number;
  longitude: number;
  title?: string;
  address?: string;
}

export interface ContactMessage extends Message {
  type: 'CONTACT';
  phoneNumber: string;
  firstName: string;
  lastName?: string;
  vcard?: string;
}

export interface Reaction {
  messageId: string;
  userId: string;
  emoji: string;
  timestamp: Date;
}
