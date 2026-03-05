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

  async getSuggestedUsers(currentUserId: number, limit = 3){
    const following = await this.prisma.follow.findMany({
      where: { followerId: currentUserId},
      select: { followingId: true}
    });

    const myFollowingIds = following.map(f => f.followingId);
    const excludeIds = [...myFollowingIds, currentUserId];

    const friendsOfFriends = await this.prisma.follow.findMany({
      where: {
        followerId: { in: myFollowingIds },
        followingId: { notIn: excludeIds }
      },
      select:{
        followingId: true
      }
    });

    const mutualMap = new Map<number, number>();
    for (const f of friendsOfFriends) {
      mutualMap.set(f.followingId, (mutualMap.get(f.followingId) ?? 0) +1);
    }

    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const myHashtags = await this.prisma.postHashtag.findMany({
      where: {
          post: { authorId: currentUserId },
          createdAt: { gte: since },
      },
      select: { tag: true },
    });

    const myTags = [...new Set(myHashtags.map(h => h.tag))];

    const sharedHashtags = new Map<number, number>();
    if(myTags.length > 0) {
      const usersWithSharedTags = await this.prisma.postHashtag.findMany({
        where: {
          post: { authorId: { notIn: excludeIds}},
          tag: { in: myTags},
        },
        select: {
          tag: true,
          post: { select: {authorId: true}},
        },
        distinct: ['tag', 'postId']
      })

      for (const h of usersWithSharedTags){
        const authorId = h.post.authorId;
        sharedHashtags.set(authorId, (sharedHashtags.get(authorId) ?? 0) +1);
      }
    }

      const allCandidateIds = [
        ... new Set([
          ...mutualMap.keys(),
          ...sharedHashtags.keys(),
        ])
      ];

      const scored = allCandidateIds.map(id => ({
        id,
        score: (mutualMap.get(id) ?? 0) + (sharedHashtags.get(id) ?? 0)*1,
        mutualFollowers: mutualMap.get(id) ?? 0,
        sharedHashtags: sharedHashtags.get(id) ?? 0,
      }));

      scored.sort((a, b) => b.score - a.score);

      let topIds: number[];
      if (scored.length === 0) {
          const popular = await this.prisma.user.findMany({
              where: { id: { notIn: excludeIds } },
              take: limit,
              orderBy: { followers: { _count: 'desc' } },
              select: { id: true },
          });
          topIds = popular.map(u => u.id);
      } else {
          topIds = scored.slice(0, limit).map(s => s.id);
      }

      const users = await this.prisma.user.findMany({
        where: { id: { in: topIds } },
        select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
            bio: true,
            _count: { select: { followers: true } },
        },
      });

    return users.map(u => ({
          id: u.id,
          name: u.name,
          username: u.username,
          avatar: u.avatar,
          bio: u.bio,
          followersCount: u._count.followers,
          isFollowedByMe: false,
      }));
    
}};