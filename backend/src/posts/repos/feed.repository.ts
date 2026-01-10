import { Injectable } from "@nestjs/common";
import { RetweetsRepository } from "./retweets.repository";
import { PostRepository } from "../posts.repository";

@Injectable()
export class FeedRepository {
    constructor(
        private readonly postRepository: PostRepository,
        private readonly retweetsRepository: RetweetsRepository
    ) {}

    async getMixedFeed() {
        const posts = await this.postRepository.getAllPosts();
        const retweets = await this.retweetsRepository.getAllRetweets();
        
        const combined = [
            ...posts.map(p => ({ ...p, type: 'post', sortDate: p.createdAt })),
            ...retweets.map(r => ({ ...r, type: 'retweet', sortDate: r.createdAt }))
        ];

        combined.sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime());

        return combined;
    }
}