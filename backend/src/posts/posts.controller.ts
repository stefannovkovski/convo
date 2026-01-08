import { Body, Controller, Get, Param, Post, Req, UseGuards, UploadedFile, UseInterceptors, Delete, Patch } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/createPost.dto';
import { PostResponseDto } from './dto/postResponse.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiBearerAuth('JWT-auth')
@Controller('posts')
export class PostsController {

    constructor(private readonly postService:PostsService){}

    @UseGuards(JwtAuthGuard)
    @Get('feed')
    @ApiOperation({ summary: 'Lists all posts (authenticated)' })
    getAuthenticatedFeed(@Req() req) {
        return this.postService.getPosts(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
            destination: './uploads/posts',
            filename: (_, file, cb) => {
                const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, uniqueName + extname(file.originalname));
            },
            }),
        }),
    )
    create(@UploadedFile() file: Express.Multer.File, @Body() dto: CreatePostDto, @Req() req): Promise<PostResponseDto> {
        const imageUrl = file
            ? `/uploads/posts/${file.filename}`
            : undefined;

        return this.postService.create(dto,imageUrl,req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:postId')
    @ApiOperation({ summary: 'Get details for a post' })
    getDetails(@Param('postId') postId: string, @Req() req,) {
        return this.postService.getDetails(+postId,req.user.userId);
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

    @UseGuards(JwtAuthGuard)
    @Post('/:postId/comments')
    @ApiOperation({ summary: 'Create a comment on a post' })
    createComment(@Param('postId') postId: string, @Body('content') content: string ,@Req() req,) {
        return this.postService.createComment(+postId,req.user.userId,content);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/comments/:commentId')
    @ApiOperation({ summary: 'Delete comment from post' })
    deleteComment(@Param('commentId') commentId: string, @Req() req,) {
        return this.postService.deleteComment(+commentId,req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/:postId')
    @ApiOperation({ summary: 'Edit a post' })
    editPost(@Param('postId') postId: string, @Body() dto: Partial<CreatePostDto>, @Req() req) {
        return this.postService.editPost(+postId, req.user.userId, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:postId')
    @ApiOperation({ summary: 'Delete a post' })
    deletePost(@Param('postId') postId: string, @Req() req) {
        return this.postService.deletePost(+postId, req.user.userId);
    }
}
