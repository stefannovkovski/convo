import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class LikesRepository {
    constructor(private readonly prisma: PrismaService) {}

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
}