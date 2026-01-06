import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: {username},
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
    });
  }

  async findByUsernameWithFollowCheck(username: string, userId: number) {
    return this.prisma.user.findUnique({
      where: { username },
      include: {
        followers: {
          where: {
            followerId: userId
          },
          select: {
            id: true
          }
        },
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true
          }
        }
      }
    });
  }

  async getUserPosts(userId: number) {
        return this.prisma.post.findMany({
            where: { authorId: userId },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        avatar: true,
                    },
                },
                quotedPost: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                username: true,
                                avatar: true,
                            },
                        },
                        _count: {
                            select: {
                                likes: true,
                                comments: true,
                                retweets: true,
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                        retweets: true,
                    }
                }
            },
        });    
      }

  async checkFollow(followerId: number, followingId: number) {
    return await this.prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          }
        }
    });
  }

async follow(followerId: number, followingId: number) {
  return await this.prisma.follow.create({
    data: {
      followerId,
      followingId,
    },
  });
}

async unfollow(followerId: number, followingId: number) {
  return await this.prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });
}

  async update(userId: number, data: any) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }


}