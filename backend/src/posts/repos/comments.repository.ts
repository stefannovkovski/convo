import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class CommentsRepository {
    constructor(private readonly prisma: PrismaService) {}

    async createComment(data: {
        postId: number;
        userId: number;
        content: string;
    }) {
        return this.prisma.comment.create({
            data,
        });
    }

    async countComments(postId: number): Promise<number> {
        return this.prisma.comment.count({
            where: { postId },
        });
    }

    async deleteComment(commentId: number, userId: number) {
        return this.prisma.comment.deleteMany({
            where: { id: commentId, userId },
        });
    }
}