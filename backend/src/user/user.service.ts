import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './user.repository';
import { PostResponseDto } from 'src/posts/dto/postResponse.dto';
import { PostRepository } from 'src/posts/posts.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository,
    private readonly postRepository: PostRepository
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

    return PostResponseDto.fromPostsWithLikes(
      posts,
      new Set(likedPosts),
      new Set(retweetedPosts)
    );
  }
  
  private sanitizeUser(user: any) {
    const { password, ...sanitizedUser } = user;
    
    return {
      ...sanitizedUser,
      avatarUrl: user.avatarUrl || '/default-avatar.png',
    };
  }
}