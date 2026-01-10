import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PostResponseDto } from "src/posts/dto/postResponse.dto";
import { UsersRepository } from "./user.repository";
import { LikesRepository } from "src/posts/repos/likes.repository";
import { RetweetsRepository } from "src/posts/repos/retweets.repository";
import { FeedRepository } from "src/posts/repos/feed.repository";
@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly likesRepository: LikesRepository,
    private readonly retweetsRepository: RetweetsRepository,
    private readonly feedRepository: FeedRepository,
  ) {}

  async findById(userId: number) {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.sanitizeUser(user, true);
  }

  private sanitizeUser(user: any, includeIsMe: boolean = false) {
    const { password, ...sanitizedUser } = user;

    const result: any = {
      ...sanitizedUser,
      avatar: user.avatar || '/default-avatar.png',
    };

    if (includeIsMe) {
      result.isMe = true;
    }

    return result;
  }
  
  async searchUsers(query: string, currentUserId: number) {
    const users = await this.usersRepository.searchUsers(query, currentUserId);

    return users.map(user => ({
      id: user.id,
      username: user.username,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      isFollowedByMe: user.followers && user.followers.length > 0,
      followersCount: user._count.followers,
    }));
  }

  async findUserPosts(username: string, userId: number) {
    const user = await this.usersRepository.findByUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const posts = await this.usersRepository.getMixedFeed(user.id);

    const likedPosts = await this.likesRepository.getUserLikedPostIds(userId);
    const retweetedPosts = await this.retweetsRepository.getUserRetweetedPostIds(userId);

    return PostResponseDto.fromMixedFeed(
      posts,
      new Set(likedPosts),
      new Set(retweetedPosts)
    );
  }

  async getDetails(username: string, loggedInUserId: number) {
    const user = await this.usersRepository.findByUsernameWithFollowCheck(
      username,
      loggedInUserId
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMe = user.id === loggedInUserId;
    const isFollowedByMe = user.followers.length > 0;

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      bio: user.bio,
      avatar: user.avatar || '/default-avatar.png',
      createdAt: user.createdAt,

      followersCount: user._count.followers,
      followingCount: user._count.following,
      postsCount: user._count.posts,

      isMe,
      isFollowedByMe,
    };
  }

  async toggleFollow(username: string, followerId: number) {
    const userToFollow = await this.usersRepository.findByUsername(username);
  
    if (!userToFollow) {
      throw new NotFoundException('User not found');
    }

    if (userToFollow.id === followerId) {
      throw new ConflictException('You cannot follow yourself');
    }

    const existingFollow = await this.usersRepository.checkFollow(
      followerId,
      userToFollow.id
    );
    
    if (existingFollow) {
      await this.usersRepository.unfollow(followerId, userToFollow.id);
      return { isFollowing: false };
    } else {
      await this.usersRepository.follow(followerId, userToFollow.id);
      return { isFollowing: true };
    }
  }

  async updateProfile(
    userId: number,
    data: { name?: string; bio?: string },
    avatarUrl?: string
  ) {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedData: any = {};
    
    if (data.name !== undefined) updatedData.name = data.name;
    if (data.bio !== undefined) updatedData.bio = data.bio;
    if (avatarUrl) updatedData.avatar = avatarUrl;

    const updatedUser = await this.usersRepository.update(userId, updatedData);

    return this.sanitizeUser(updatedUser, true);
  }
}