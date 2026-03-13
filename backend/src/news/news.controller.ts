import { Controller, Get, Query } from '@nestjs/common';

@Controller('news')
export class NewsController {
  @Get()
  async getNews(@Query('category') category: string = 'technology') {
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=3&apiKey=${process.env.NEWS_API_KEY}`
    );
    return res.json();
  }
}