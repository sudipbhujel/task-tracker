import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dtos/register-auth.dto';
import { MeEntity } from './entities/me.entity';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard, User, UserContext } from './guards/jwt-auth.guard';
import { AuthLoginDto } from './dtos/auth-login.dto';
import { MessageEntity } from '@/entities/message.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async create(@Req() req: Request, @Body() body: RegisterUserDto) {
    const user = await this.authService.register(req, body);

    return new MeEntity(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req: Request,
    @UserContext() user: User,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() _body: AuthLoginDto,
  ) {
    const _user = await this.authService.login(req, user);

    return new MeEntity(_user);
  }

  @ApiBearerAuth()
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@UserContext() user: User) {
    return new MeEntity(user);
  }

  @ApiBearerAuth()
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req: Request) {
    this.authService.logout(req);

    return new MessageEntity('Logged out successfully');
  }
}
