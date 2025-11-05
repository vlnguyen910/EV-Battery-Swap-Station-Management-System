import {
  Controller,
  HttpStatus,
  NotImplementedException,
  Post,
  HttpCode,
  Body,
  Res,
  Req,
  Get,
  UseGuards,
  Query
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const result = await this.authService.login(loginDto);
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

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req: Request) {
    // Guard redirects to Google
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    const result = await this.authService.googleLogin(req.user);

    response.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: (this.configService.get<number>('REFRESH_TOKEN_COOKIE_MAX_AGE_DAYS') || 7) * 24 * 60 * 60 * 1000,
      path: '/auth/refresh',
    });

    // Redirect to frontend with access token
    const frontendUrl = this.configService.get<string>('GOOGLE_FRONTEND_RETURN') || 'http://localhost:3000';
    return response.redirect(`${frontendUrl}/auth/callback?token=${result.accessToken}`);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @HttpCode(HttpStatus.OK)
  @Post('resend-verification')
  async resendVerificationEmail(@Body('email') email: string) {
    return this.authService.resendVerificationEmail(email);
  }

  @Post('forget-password')
  async sendEmailForgetPassword(@Body('email') email: string) {
    return this.authService.forgetPassword(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto
  ) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}


