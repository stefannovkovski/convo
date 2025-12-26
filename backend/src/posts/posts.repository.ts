import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Post } from "@prisma/client";

@Injectable()
export class PostRepository {
    constructor(private readonly prisma:PrismaService){}

    createPost(data: {
        content: string;
        imageUrl?: string;
        authorId: number;
    }){
        return this.prisma.post.create({ 
            data,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                    },
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
}