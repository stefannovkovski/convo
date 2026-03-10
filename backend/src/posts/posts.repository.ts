import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class PostRepository {
    constructor(private readonly prisma: PrismaService) {}

    getAllPosts() {
        return this.prisma.post.findMany({
            where: {
                replyToPostId: null,
            },
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
                                replies: true,
                                retweets: true,
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                        replies: true,
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
                replies: {
                    orderBy: { createdAt: 'asc' },
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
                                replies: true,
                                retweets: true,
                            }
                        }
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
                                replies: true,
                                retweets: true,
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                        replies: true,
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
        replyToPostId?: number;
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
                                replies: true,
                                retweets: true,
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                        replies: true,
                        retweets: true,
                    }
                }
            },
        });
    }

    async updatePost(postId: number, data: Partial<{ content: string; imageUrl: string }>) {
        return this.prisma.post.update({
            where: { id: postId },
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

    async deletePost(postId: number) {
        return this.prisma.post.delete({
            where: { id: postId },
        });
    }
}