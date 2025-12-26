export class PostResponseDto {
  id: number;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  author: { id: number; name:string; username: string };
  counts: { likes: number; comments: number; retweets: number };

  static fromPost(post: any): PostResponseDto {
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
    };
  }

  static fromPosts(posts: any[]): PostResponseDto[] {
    return posts.map(PostResponseDto.fromPost);
  }
}
