import { Injectable } from '@nestjs/common';
import { PostRepository } from './posts.repository';
import { CreatePostDto } from './dto/createPost.dto';
import { PostResponseDto } from './dto/postResponse.dto';

@Injectable()
export class PostsService {

    constructor(private readonly postRepository: PostRepository){}

    async getPosts(userId?: number): Promise<PostResponseDto[]>{
        const posts = await this.postRepository.getAllPosts();
        
        if(!userId){
            return PostResponseDto.fromPosts(posts, false, false);
        }
        
        const likedPosts = await this.postRepository.getUserLikedPostIds(userId);
        const retweetedPosts = await this.postRepository.getUserRetweetedPostIds(userId);

        const likedPostIdsSet = new Set(likedPosts);
        const retweetedPostIdsSet = new Set(retweetedPosts);
        return PostResponseDto.fromPostsWithLikes(posts, likedPostIdsSet, retweetedPostIdsSet);
    }

    async create(dto: CreatePostDto, userId: number): Promise<PostResponseDto>{
        const post = await this.postRepository.createPost({
            content : dto.content,
            imageUrl: dto.imageUrl,
            authorId: userId,
            quotedPostId: dto.quotedPostId,
        });

        return PostResponseDto.fromPost(post, false);
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



}
