import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/createPost.dto';
import { PostResponseDto } from './dto/postResponse.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth('JWT-auth')
@Controller('posts')
export class PostsController {

    constructor(private readonly postService:PostsService){}

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Create a post' })
    create(@Body() dto: CreatePostDto, @Req() req): Promise<PostResponseDto>{
        return this.postService.create(dto, req.user.userId);
    }
}
