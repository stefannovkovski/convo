import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { UsersRepository } from './user.repository';
import { PostRepository } from 'src/posts/posts.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, PostRepository]
})
export class UsersModule {}
