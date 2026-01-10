import { Module } from '@nestjs/common';

import { UsersRepository } from './user.repository';
import { PostsModule } from 'src/posts/posts.module';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';

@Module({
  imports: [PostsModule], 
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersRepository, UsersService]
})
export class UsersModule {}