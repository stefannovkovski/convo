export interface PostResponseDto {
  id: number;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  author: {
    id: number;
    name: string;
    username: string;
  };
  counts: {
    likes: number;
    comments: number;
    retweets: number;
  };
  isLikedByMe: boolean;
  isRetweetedByMe: boolean;
  quotedPost?: PostResponseDto;
}