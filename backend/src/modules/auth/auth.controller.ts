import {
  Controller,
  HttpStatus,
  NotImplementedException,
  Post,
  HttpCode,
  Body,
  UseGuards,
  Get,
  Request
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() input: { emailOrPhone: string; password: string }) {
    if (!input.emailOrPhone || !input.password) {
      throw new NotImplementedException('Email/Phone and password are required');
    }

    return this.authService.signIn(input);
  }

  @Post('register')
  register(@Body() input: { email: string; phone: string; username: string; password: string }) {
    return this.authService.register(input);
  }

  // @HttpCode(HttpStatus.OK)
  // @Post('refresh')
  // refresh(@Body() body: { refreshToken: string }) {
  //   if (!body.refreshToken) {
  //     throw new NotImplementedException('Refresh token is required');
  //   }
  //   return this.authService.refreshAccessToken(body.refreshToken);
  // }
}


