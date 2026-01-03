import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/createPost.dto';
import { PostResponseDto } from './dto/postResponse.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth('JWT-auth')
@Controller('posts')
export class PostsController {

    constructor(private readonly postService:PostsService){}

    @Get('public')
    @ApiOperation({ summary: 'Lists all posts (unauthenticated)' })
    getPublicFeed() {
        return this.postService.getPosts();
    }

    @UseGuards(JwtAuthGuard)
    @Get('feed')
    @ApiOperation({ summary: 'Lists all posts (authenticated)' })
    getAuthenticatedFeed(@Req() req) {
        return this.postService.getPosts(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Create a post or quote tweet' })
    create(@Body() dto: CreatePostDto, @Req() req): Promise<PostResponseDto> {
        return this.postService.create(dto, req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/:postId/like')
    @ApiOperation({ summary: 'Like/Unlike a post' })
    toggleLike(@Param('postId') postId: string, @Req() req){
        return this.postService.toggleLike(+postId, req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/:postId/retweet')
    @ApiOperation({ summary: 'Retweet/Remove retweet for post' })
    toggleRetweet(@Param('postId') postId: string, @Req() req){
        return this.postService.toggleRetweet(+postId, req.user.userId);
    }

    
}
