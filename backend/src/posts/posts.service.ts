import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from './posts.repository';
import { CreatePostDto } from './dto/createPost.dto';
import { PostResponseDto } from './dto/postResponse.dto';
import { PostDetailsResponseDto } from './dto/postDetailsResponse.dto';

@Injectable()
export class PostsService {

    constructor(private readonly postRepository: PostRepository){}

    async getPosts(userId: number): Promise<PostResponseDto[]>{
        const mixedFeed = await this.postRepository.getMixedFeed();
        
        const likedPosts = await this.postRepository.getUserLikedPostIds(userId);
        const retweetedPosts = await this.postRepository.getUserRetweetedPostIds(userId);

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

    
    async getDetails(postId: number,userId: number){
        const post = await this.postRepository.getPostById(postId);
        if (!post) {
            throw new NotFoundException(`Post with id ${postId} not found`);
        }
        const likedPosts = await this.postRepository.getUserLikedPostIds(userId);
        const retweetedPosts = await this.postRepository.getUserRetweetedPostIds(userId);

        const likedPostIdsSet = new Set(likedPosts);
        const retweetedPostIdsSet = new Set(retweetedPosts);
        
        return PostDetailsResponseDto.fromPostWithComments(
            post,
            likedPostIdsSet.has(postId),
            retweetedPostIdsSet.has(postId)
        );    
    }

    async toggleLike(postId: number, userId:number){
        const existingLike = await this.postRepository.findLike(userId, postId);

        if(existingLike){
            await this.postRepository.deleteLike(userId, postId);
        }else{
            await this.postRepository.createLike({ userId, postId });
        }

        const likeCount = await this.postRepository.getLikeCount(postId);

        return { 
            postId,
            isLiked: !existingLike, 
            likeCount           
        };
    }

    async toggleRetweet(postId: number, userId:number){
        const existingRetweet = await this.postRepository.findRetweet(userId, postId);

        if(existingRetweet){
            await this.postRepository.deleteRetweet(userId, postId);
        }else{
            await this.postRepository.createRetweet({ userId, postId });
        }

        const retweetCount = await this.postRepository.getRetweetCount(postId);

        return { 
            postId,
            isRetweeted: !existingRetweet, 
            retweetCount           
        };
    }

    async createComment(postId: number,userId: number,content: string): Promise<{ commentCount: number }> {
        const post = await this.postRepository.getPostById(postId);
        if (!post) {
            throw new NotFoundException('Post not found');
        }

        if (!content) {
            throw new BadRequestException('Comment content is required');
        }

        await this.postRepository.createComment({
            postId,
            userId,
            content,
        });

        const commentCount = await this.postRepository.countComments(postId);

        return { commentCount };
    }

    async deleteComment(commentId: number, userId: number) {
        await this.postRepository.deleteComment(commentId, userId);
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
