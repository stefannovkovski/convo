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

  async searchUsers(query: string, currentUserId: number) {
    return this.prisma.user.findMany({
      where: {
        AND: [
          {
            id: {
              not: currentUserId
            }
          },
          {
            OR: [
              {
                username: {
                  contains: query,
                  mode: 'insensitive'
                }
              },
              {
                name: {
                  contains: query,
                  mode: 'insensitive'
                }
              }
            ]
          }
        ]
      },
      include: {
        followers: {
          where: {
            followerId: currentUserId
          },
          select: {
            id: true
          }
        },
        _count: {
          select: {
            followers: true,
          }
        }
      },
      take: 20,
      orderBy: {
        followers: {
          _count: 'desc'
        }
      }
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
            orderBy: {
                createdAt: 'desc',
            }
        });    
      }

      async getMixedFeed(userId: number) {
      const posts = await this.getUserPosts(userId);
      const retweets = await this.prisma.retweet.findMany({
              where: { userId: userId },
              include: {
                  user: {
                      select: {
                          id: true,
                          name: true,
                          username: true,
                          avatar: true,
                      },
                  },
                  post: {
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
                      }
                  }
              },
          });
          
          const combined = [
              ...posts.map(p => ({ ...p, type: 'post', sortDate: p.createdAt })),
              ...retweets.map(r => ({ ...r, type: 'retweet', sortDate: r.createdAt}))
          ];

          combined.sort((a, b)=> b.sortDate.getTime() - a.sortDate.getTime());

          return combined;
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