export interface ChatMessage {
    id: string;
    senderId: number;
    text: string;
    createdAt: Date;
    read: boolean;
  }
  
  export interface Chat {
    id: string;
    participants: number[];
    participantDetails?: {
      [userId: number]: {
        username: string;
        name: string;
        avatar?: string;
      };
    };
    lastMessage?: string;
    lastMessageAt?: Date;
    createdAt: Date;
    unreadCount?: number;
  }