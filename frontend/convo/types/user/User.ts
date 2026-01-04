export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  createdAt: Date;
  avatar?: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
}