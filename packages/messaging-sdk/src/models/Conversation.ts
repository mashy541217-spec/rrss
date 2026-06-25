export interface Participant {
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'GUEST';
}

export interface Conversation {
  id: string;
  type: 'PRIVATE' | 'GROUP' | 'SUPERGROUP' | 'CHANNEL' | 'THREAD';
  title?: string;
  description?: string;
  participantsCount?: number;
  createdAt?: Date;
}
