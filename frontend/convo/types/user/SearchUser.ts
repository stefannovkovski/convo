export type SearchUser = {
  id: number;
  username: string;
  name: string;
  avatar?: string;
  bio?: string;
  isFollowedByMe: boolean;
  followersCount: number;
};
