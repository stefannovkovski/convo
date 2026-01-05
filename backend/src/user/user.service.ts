import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PostResponseDto } from "src/posts/dto/postResponse.dto";
import { UsersRepository } from "./user.repository";
import { PostRepository } from "src/posts/posts.repository";

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly postRepository: PostRepository,
  ) {}

  async findById(userId: number) {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.sanitizeUser(user);
  }

  async findUserPosts(username: string, userId: number) {
    const user = await this.usersRepository.findByUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const posts = await this.usersRepository.getUserPosts(user.id);

    const likedPosts = await this.postRepository.getUserLikedPostIds(userId);
    const retweetedPosts = await this.postRepository.getUserRetweetedPostIds(userId);

    return PostResponseDto.fromPostsWithLikes( posts, new Set(likedPosts), new Set(retweetedPosts),);
  }

  async getDetails(username: string, loggedInUserId: number) {
    const user =
      await this.usersRepository.findByUsernameWithFollowCheck( username, loggedInUserId,);

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
      avatar: user.avatar,
      createdAt: user.createdAt,

      followersCount: user._count.followers,
      followingCount: user._count.following,
      postsCount: user._count.posts,

      isMe,
      isFollowedByMe,
    };
  }

  async toggleFollow(username: string, followerId: number){
    const userToFollow = await this.usersRepository.findByUsername(username);
  
    if (!userToFollow) {
      throw new NotFoundException('User not found');
    }

    if (userToFollow.id === followerId) {
      throw new ConflictException('You cannot follow yourself');
    }

    const existingFollow = await this.usersRepository.checkFollow(followerId,userToFollow.id,);
    
    if(existingFollow){

      await this.usersRepository.unfollow(followerId, userToFollow.id);
      return { isFollowing: false };
    } else {
      await this.usersRepository.follow(followerId, userToFollow.id);
      return { isFollowing: true };
    }
  
  }


  private sanitizeUser(user: any) {
    const { password, ...sanitizedUser } = user;

    return {
      ...sanitizedUser,
      avatar: user.avatar || '/default-avatar.png',
    };
  }
}
