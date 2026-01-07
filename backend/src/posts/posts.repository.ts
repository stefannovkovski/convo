import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class PostRepository {
    constructor(private readonly prisma: PrismaService) {}

    getAllPosts() {
        return this.prisma.post.findMany({
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
    async getMixedFeed() {
    const posts = await this.getAllPosts();
    const retweets = await this.prisma.retweet.findMany({
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

    getPostById(postId: number) {
        return this.prisma.post.findUnique({
            where: { id: postId },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        avatar: true,
                    },
                },
                comments: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                    user: {
                        select: {
                        id: true,
                        name: true,
                        username: true,
                        avatar: true,
                        },
                    },
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

    createPost(data: {
        content: string;
        imageUrl?: string;
        authorId: number;
        quotedPostId?: number;
    }) {
        return this.prisma.post.create({ 
            data,
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

    getUserLikedPostIds(userId: number): Promise<number[]> {
        return this.prisma.like.findMany({
            where: { userId },
            select: { postId: true },
        }).then(likes => likes.map(like => like.postId));
    }

    findLike(userId: number, postId: number) {
        return this.prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId,
                },
            },
        });
    }

    async getLikeCount(postId: number): Promise<number> {
        return this.prisma.like.count({
            where: { postId }
        });
    }

    createLike(data: { userId: number, postId: number }) {
        return this.prisma.like.create({ data });
    }

    deleteLike(userId: number, postId: number) {
        return this.prisma.like.delete({
            where: { 
                userId_postId: {
                    userId,
                    postId,
                }
            }
        });
    }

    findRetweet(userId: number, postId: number) {
        return this.prisma.retweet.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId,
                },
            },
        });
    }

    async getRetweetCount(postId: number): Promise<number> {
        return this.prisma.retweet.count({
            where: { postId }
        });
    }

    createRetweet(data: { userId: number, postId: number }) {
        return this.prisma.retweet.create({ data });
    }

    deleteRetweet(userId: number, postId: number) {
        return this.prisma.retweet.delete({
            where: { 
                userId_postId: {
                    userId,
                    postId,
                }
            }
        });
    }

    getUserRetweetedPostIds(userId: number): Promise<number[]> {
        return this.prisma.retweet.findMany({
            where: { userId },
            select: { postId: true },
        }).then(retweets => retweets.map(retweet => retweet.postId));
    }

    async createComment(data: {postId: number;userId: number;content: string;}) {
        return this.prisma.comment.create({
            data,
        });
    }

    async countComments(postId: number): Promise<number> {
    return this.prisma.comment.count({
        where: { postId },
    });
    }

    async deleteComment(commentId:number, userId: number){
        return this.prisma.comment.deleteMany({
            where: { id: commentId, userId },
        });
    }
}