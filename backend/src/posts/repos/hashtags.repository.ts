import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class HashtagsRepository {
    constructor(private readonly prisma: PrismaService) {}

    async saveHashtagsForPost(postId: number, content: string): Promise<void> {
        const hashtags = content.match(/#[\w]+/g) ?? [];

        if(hashtags.length === 0) return;

        const normalized = [...new Set(hashtags.map(tag => tag.toLowerCase()))];

        await this.prisma.postHashtag.createMany({
            data: normalized.map(tag => ({ tag, postId}))
        });
    }

    async getTrending(limit: number): Promise< { tag: string; count: number}[]> {
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const results = await this.prisma.postHashtag.groupBy({
            by: ['tag'],
            where: { createdAt: { gte: since } },
            _count: { tag: true },
            orderBy: { _count: { tag: 'desc' } },
            take: limit,
        });

        return results.map(
            r => ({ tag: r.tag, count: r._count.tag })
        );
    }
}