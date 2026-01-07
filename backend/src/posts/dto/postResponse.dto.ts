export class PostResponseDto {
  id: number;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  author: { id: number; name: string; username: string; avatar: string; };
  counts: { likes: number; comments: number; retweets: number };
  isLikedByMe: boolean;
  isRetweetedByMe: boolean;
  quotedPost?: PostResponseDto;

  isRetweet?: boolean;
  retweetedBy?: { id: number; name: string; username: string; avatar: string; };
  retweetedAt?: Date;

  static fromPost(post: any, isLikedByMe: boolean = false, isRetweetedByMe: boolean = false): PostResponseDto {
    return {
      id: post.id,
      content: post.content,
      imageUrl: post.imageUrl ?? undefined,
      createdAt: post.createdAt,
      author: post.author,
      counts: {
        likes: post._count.likes,
        comments: post._count.comments,
        retweets: post._count.retweets,
      },
      isLikedByMe,
      isRetweetedByMe,
      quotedPost: post.quotedPost
        ? PostResponseDto.fromPost(post.quotedPost, false, false)
        : undefined,
      };
  }

    static fromRetweet(retweet: any, isLikedByMe: boolean = false, isRetweetedByMe: boolean = false): PostResponseDto {
    const post = retweet.post;
    return {
      id: post.id,
      content: post.content,
      imageUrl: post.imageUrl ?? undefined,
      createdAt: post.createdAt,
      author: post.author,
      counts: {
        likes: post._count.likes,
        comments: post._count.comments,
        retweets: post._count.retweets,
      },
      isLikedByMe,
      isRetweetedByMe,
      quotedPost: post.quotedPost
        ? PostResponseDto.fromPost(post.quotedPost, false, false)
        : undefined,
      isRetweet: true,
      retweetedBy: retweet.user,
      retweetedAt: retweet.createdAt,
    };
  }



  static fromPosts(posts: any[], isLikedByMe: boolean = false , isRetweetedByMe: boolean = false): PostResponseDto[] {
    return posts.map(post => PostResponseDto.fromPost(post, isLikedByMe, isRetweetedByMe));
  }

  static fromPostsWithLikes(posts: any[], likedPostIds: Set<number>, retweetedPostIds: Set<number>): PostResponseDto[] {
    return posts.map(post => PostResponseDto.fromPost(post, likedPostIds.has(post.id), retweetedPostIds.has(post.id)));
  }

  static fromMixedFeed(items: any[], likedPostIds: Set<number>, retweetedPostIds: Set<number>): PostResponseDto[] {
    return items.map(item => {
      if (item.post) {
        return PostResponseDto.fromRetweet(
          item, 
          likedPostIds.has(item.post.id), 
          retweetedPostIds.has(item.post.id)
        );
      } else {
        return PostResponseDto.fromPost(
          item, 
          likedPostIds.has(item.id), 
          retweetedPostIds.has(item.id)
        );
      }
    });
  }
}