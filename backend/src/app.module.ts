import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PostsModule } from './posts/posts.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { FirebaseModule } from './firebase/firebase.module';
import { NewsController } from './news/news.controller';

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,
    }),PrismaModule,PostsModule,AuthModule,UsersModule,FirebaseModule],
  controllers: [AppController, NewsController],
  providers: [AppService],
})
export class AppModule {}
