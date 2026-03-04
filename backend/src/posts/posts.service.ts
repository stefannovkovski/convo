import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from './posts.repository';
import { CreatePostDto } from './dto/createPost.dto';
import { PostResponseDto } from './dto/postResponse.dto';
import { PostDetailsResponseDto } from './dto/postDetailsResponse.dto';
import { LikesRepository } from './repos/likes.repository';
import { RetweetsRepository } from './repos/retweets.repository';
import { CommentsRepository } from './repos/comments.repository';
import { FeedRepository } from './repos/feed.repository';
import { FirebaseService } from '../firebase/firebase.service';
import { UsersRepository } from 'src/user/user.repository';

@Injectable()
export class PostsService {
    constructor(
        private readonly postRepository: PostRepository,
        private readonly likesRepository: LikesRepository,
        private readonly retweetsRepository: RetweetsRepository,
        private readonly commentsRepository: CommentsRepository,
        private readonly feedRepository: FeedRepository,
        private readonly firebaseService: FirebaseService,
        private readonly usersRepository: UsersRepository,
    ) {}

    async getPosts(userId: number): Promise<PostResponseDto[]> {
        const mixedFeed = await this.feedRepository.getMixedFeed();
        
        const likedPosts = await this.likesRepository.getUserLikedPostIds(userId);
        const retweetedPosts = await this.retweetsRepository.getUserRetweetedPostIds(userId);

        const likedPostIdsSet = new Set(likedPosts);
        const retweetedPostIdsSet = new Set(retweetedPosts);
        
        return PostResponseDto.fromMixedFeed(mixedFeed, likedPostIdsSet, retweetedPostIdsSet);
    }

    async create(dto: CreatePostDto, imageUrl: string | undefined, userId: number): Promise<PostResponseDto> {
        const post = await this.postRepository.createPost({
            content: dto.content,
            imageUrl,
            authorId: userId,
            quotedPostId: dto.quotedPostId,
        });
        return PostResponseDto.fromPost(post, false);
    }

    async getDetails(postId: number, userId: number) {
        const post = await this.postRepository.getPostById(postId);
        if (!post) {
            throw new NotFoundException(`Post with id ${postId} not found`);
        }
        
        const likedPosts = await this.likesRepository.getUserLikedPostIds(userId);
        const retweetedPosts = await this.retweetsRepository.getUserRetweetedPostIds(userId);

        const likedPostIdsSet = new Set(likedPosts);
        const retweetedPostIdsSet = new Set(retweetedPosts);
        
        return PostDetailsResponseDto.fromPostWithComments(
            post,
            likedPostIdsSet.has(postId),
            retweetedPostIdsSet.has(postId)
        );    
    }

    async toggleLike(postId: number, userId: number) {
        const existingLike = await this.likesRepository.findLike(userId, postId);

        if (existingLike) {
            await this.likesRepository.deleteLike(userId, postId);
        } else {
            await this.likesRepository.createLike({ userId, postId });
            const post = await this.postRepository.getPostById(postId);
            const user = await this.usersRepository.findById(userId);
            if (post && post.authorId !== userId && this.firebaseService.isInitialized() && user) {
                await this.firebaseService.createNotification(post.authorId, {
                    type: 'like',
                    title: 'New like',
                    body: `${user.name} (@${user.username}) liked your post`,
                    link: `/dashboard/${post.author.username}/status/${postId}`,
                });
            }
        }

        const likeCount = await this.likesRepository.getLikeCount(postId);

        return { 
            postId,
            isLiked: !existingLike, 
            likeCount           
        };
    }

    async toggleRetweet(postId: number, userId: number) {
        const existingRetweet = await this.retweetsRepository.findRetweet(userId, postId);

        if (existingRetweet) {
            await this.retweetsRepository.deleteRetweet(userId, postId);
        } else {
            await this.retweetsRepository.createRetweet({ userId, postId });
        }

        const retweetCount = await this.retweetsRepository.getRetweetCount(postId);

        return { 
            postId,
            isRetweeted: !existingRetweet, 
            retweetCount           
        };
    }

    async createComment(postId: number, userId: number, content: string): Promise<{ commentCount: number }> {
        const post = await this.postRepository.getPostById(postId);
        if (!post) {
            throw new NotFoundException('Post not found');
        }

        if (!content) {
            throw new BadRequestException('Comment content is required');
        }

        await this.commentsRepository.createComment({
            postId,
            userId,
            content,
        });

        const commentCount = await this.commentsRepository.countComments(postId);

        return { commentCount };
    }

    async deleteComment(commentId: number, userId: number) {
        await this.commentsRepository.deleteComment(commentId, userId);
    }

    async editPost(postId: number, userId: number, dto: Partial<CreatePostDto>) {
        const post = await this.postRepository.getPostById(postId);
        
        if (!post) {
            throw new NotFoundException(`Post with id ${postId} not found`);
        }

        if (post.authorId !== userId) {
            throw new BadRequestException('You can only edit your own posts');
        }

        return this.postRepository.updatePost(postId, dto);
    }

    async deletePost(postId: number, userId: number) {
        const post = await this.postRepository.getPostById(postId);
        
        if (!post) {
            throw new NotFoundException(`Post with id ${postId} not found`);
        }

        if (post.authorId !== userId) {
            throw new BadRequestException('You can only delete your own posts');
        }

        await this.postRepository.deletePost(postId);
        
        return { message: 'Post deleted successfully' };
    }
}