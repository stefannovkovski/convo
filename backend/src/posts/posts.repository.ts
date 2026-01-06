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

    async getUserSimpleRetweets(userId: number) {
        return this.prisma.retweet.findMany({
            where: { userId },
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
    }
}