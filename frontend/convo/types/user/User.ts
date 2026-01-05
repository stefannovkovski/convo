export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  createdAt: Date;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
  isMe?: boolean;
  isFollowedByMe?: boolean;
}