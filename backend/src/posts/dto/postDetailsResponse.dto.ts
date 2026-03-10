import { PostResponseDto } from "./postResponse.dto";

export class PostDetailsResponseDto extends PostResponseDto {
  replies: PostResponseDto[];

  static fromPostWithReplies(
    post: any,
    likedPostIds: Set<number>,
    retweetedPostIds: Set<number>
  ): PostDetailsResponseDto {
    const base = PostResponseDto.fromPost(
      post,
      likedPostIds.has(post.id),
      retweetedPostIds.has(post.id)
    );

    return {
      ...base,
      replies:
        post.replies?.map((p: any) =>
          PostResponseDto.fromPost(
            p,
            likedPostIds.has(p.id),
            retweetedPostIds.has(p.id)
          )
        ) ?? [],
    };
  }
}