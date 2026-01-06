import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: "http://localhost:3000",
    credentials: true,
  });

  const postsUploadDir = join(process.cwd(), 'uploads', 'posts');
  const avatarsUploadDir = join(process.cwd(), 'uploads', 'avatars');
  
  if (!fs.existsSync(postsUploadDir)) {
    fs.mkdirSync(postsUploadDir, { recursive: true });
  }
  
  if (!fs.existsSync(avatarsUploadDir)) {
    fs.mkdirSync(avatarsUploadDir, { recursive: true });
  }
  
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });
  
  const config = new DocumentBuilder()
    .setTitle('Your API')
    .setDescription('API documentation for your NestJS application')
    .setVersion('1.0')
    .addTag('Authentication', 'User authentication endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
}
bootstrap();