import {
  Controller,
  HttpStatus,
  NotImplementedException,
  Post,
  HttpCode,
  Body,
  Res,
  Req
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './guards/auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const result = await this.authService.signIn(loginDto);
    response.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      sameSite: 'strict', // Bảo mật hơn 'lax'
      maxAge: (this.configService.get<number>('REFRESH_TOKEN_COOKIE_MAX_AGE_DAYS') || 7) * 24 * 60 * 60 * 1000, // 7 days
      path: '/auth/refresh',
    });

    return {
      accessToken: result.accessToken,
      user: result.user,
    }
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    const refreshToken = request.cookies?.refreshToken;

    if (!refreshToken) {
      throw new NotImplementedException('Refresh token not found');
    }

    const result = await this.authService.refreshAccessToken(refreshToken);

    return {
      accessToken: result.accessToken,
    };
  }
}


