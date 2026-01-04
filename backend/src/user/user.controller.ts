import { 
  Controller, 
  Get, 
  Param, 
  Req, 
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './user.service';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  getCurrentUser(@Req() req) {
    return this.usersService.findById(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:username')
  @ApiOperation({ summary: 'Get posts made by user with username' })
  getPostsByUsername(@Param('username') username: string, @Req() req) {
      return this.usersService.findUserPosts( username, req.user.userId);
  }


}