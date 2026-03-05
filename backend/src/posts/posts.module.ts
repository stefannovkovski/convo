import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostRepository } from './posts.repository';
import { LikesRepository } from './repos/likes.repository';
import { RetweetsRepository } from './repos/retweets.repository';
import { CommentsRepository } from './repos/comments.repository';
import { FeedRepository } from './repos/feed.repository';
import { UsersRepository } from 'src/user/user.repository';
import { HashtagsRepository } from './repos/hashtags.repository';

@Module({
  controllers: [PostsController],
  providers: [
    PostsService,
    PostRepository,
    LikesRepository,
    RetweetsRepository,
    CommentsRepository,
    FeedRepository,
    UsersRepository,
    HashtagsRepository,
  ],
  exports: [
    PostRepository,
    LikesRepository,
    RetweetsRepository,
    CommentsRepository,
    FeedRepository
  ]
})
export class PostsModule {}