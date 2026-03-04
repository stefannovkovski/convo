export type NotificationType = 'like' | 'comment' | 'follow' | 'mention' | 'retweet' | 'general';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: { seconds: number; nanoseconds: number } | Date;
  link?: string;
  actorId?: number;
  actorUsername?: string;
  actorName?: string;
}

export interface NotificationPayload {
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
  actorId?: number;
  actorUsername?: string;
  actorName?: string;
}
