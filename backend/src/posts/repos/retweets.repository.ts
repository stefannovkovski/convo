import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class RetweetsRepository {
    constructor(private readonly prisma: PrismaService) {}

    async getAllRetweets() {
        return this.prisma.retweet.findMany({
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
}