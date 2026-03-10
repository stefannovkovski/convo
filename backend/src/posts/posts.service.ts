import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from './posts.repository';
import { CreatePostDto } from './dto/createPost.dto';
import { PostResponseDto } from './dto/postResponse.dto';
import { PostDetailsResponseDto } from './dto/postDetailsResponse.dto';
import { LikesRepository } from './repos/likes.repository';
import { RetweetsRepository } from './repos/retweets.repository';
import { FeedRepository } from './repos/feed.repository';
import { FirebaseService } from '../firebase/firebase.service';
import { UsersRepository } from 'src/user/user.repository';
import { HashtagsRepository } from './repos/hashtags.repository';

const CROK_USERNAME = 'crok';
const CROK_MENTION_REGEX = /@[Cc]rok\b/;


@Injectable()
export class PostsService {
    constructor(
        private readonly postRepository: PostRepository,
        private readonly likesRepository: LikesRepository,
        private readonly retweetsRepository: RetweetsRepository,
        private readonly feedRepository: FeedRepository,
        private readonly firebaseService: FirebaseService,
        private readonly usersRepository: UsersRepository,
        private readonly hashtagRepository: HashtagsRepository,
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
            replyToPostId: dto.replyToPostId,
        });

        if(dto.content.includes('#')) {
            await this.hashtagRepository.saveHashtagsForPost(post.id, dto.content);
        }

        if (CROK_MENTION_REGEX.test(post.content)) {
            this.handleCrokMention(post.id, dto.content, userId).catch(err =>
                console.error('Error handling Crok mention:', err)
            );
        }
        return PostResponseDto.fromPost(post, false);
    }

    private async handleCrokMention(postId: number, content: string, userId: number): Promise<void> {
        const crokUser = await this.usersRepository.findByUsername(CROK_USERNAME);
        const user = await this.usersRepository.findById(userId);
        if (!crokUser) {
            console.warn('[Crok] Bot user not found in DB — create a user with username "crok"');
            return;
        }

        const geminiReply = await this.callGeminiApi(content, user?.username ?? '');
        if (!geminiReply) return;
        
        await this.postRepository.createPost({
            content: geminiReply,
            authorId: crokUser.id,
            replyToPostId: postId,
        });
    }

        private async callGeminiApi(postContent: string, username: string): Promise<string | null> {
            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
            console.error('[Crok] GEMINI_API_KEY env variable is not set');
            return null;
        }
    
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent`;

        const body = {
            contents: [
                {
                    role: 'user',
                    parts: [
                        {
                            text: `You are Crok, a witty AI living inside a social media platform. 
    @ ${username} mentioned you. Reply as a comment — keep it 1-3 sentences, casual and engaging.
    User's post: "${postContent}"`,
                        },
                    ],
                },
            ],
            generationConfig: {
                temperature: 0.9,
                maxOutputTokens: 800,
            },
        };
    
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey, 
            },
            body: JSON.stringify(body),
        });
    
        if (!response.ok) {
            console.error('[Crok] Gemini API error:', await response.text());
            return null;
        }
    
        const data = await response.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
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
        
        return PostDetailsResponseDto.fromPostWithReplies(
            post,
            likedPostIdsSet,
            retweetedPostIdsSet,
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

    async getTrending(): Promise<{ tag: string; count: number}[]> {
        return this.hashtagRepository.getTrending(3);
    }

    async getPostsByHashtag(tag: string, userId: number): Promise<PostResponseDto[]> {
        const normalizedTag = tag.startsWith('#') ? tag.toLowerCase() : `#${tag.toLowerCase()}`;
        const posts = await this.hashtagRepository.getPostsByTag(normalizedTag);
        const likedPosts = await this.likesRepository.getUserLikedPostIds(userId);
        const retweetedPosts = await this.retweetsRepository.getUserRetweetedPostIds(userId);

        const likedPostIdsSet = new Set(likedPosts);
        const retweetedPostIdsSet = new Set(retweetedPosts);

        return PostResponseDto.fromPostsWithLikes(posts, likedPostIdsSet, retweetedPostIdsSet);
    }
}