import { Injectable } from '@nestjs/common';
import { PostRepository } from './posts.repository';
import { CreatePostDto } from './dto/createPost.dto';
import { PostResponseDto } from './dto/postResponse.dto';

@Injectable()
export class PostsService {

    constructor(private readonly postRepository: PostRepository){}

    async create(dto: CreatePostDto, userId: number): Promise<PostResponseDto>{
        const post = await this.postRepository.createPost({
            content : dto.content,
            imageUrl: dto.imageUrl,
            authorId: userId,
        });

        return PostResponseDto.fromPost(post);
    }
}
