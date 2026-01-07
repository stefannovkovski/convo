import { PostResponseDto } from "./postResponse.dto";

export class PostDetailsResponseDto extends PostResponseDto {
  comments: {
    id: number;
    content: string;
    createdAt: Date;
    user: { id: number; name: string; username: string; avatar: string };
  }[];

  static fromPostWithComments(post: any, isLikedByMe = false, isRetweetedByMe = false): PostDetailsResponseDto {
    return {
      ...PostResponseDto.fromPost(post, isLikedByMe, isRetweetedByMe),
      comments: post.comments?.map((c: any) => ({
        id: c.id,
        content: c.content,
        createdAt: c.createdAt,
        user: {
          id: c.user.id,
          name: c.user.name,
          username: c.user.username,
          avatar: c.user.avatar,
        },
      })) ?? [],
    };
  }
}
