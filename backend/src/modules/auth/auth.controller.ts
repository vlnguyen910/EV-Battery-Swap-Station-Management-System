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
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() emailOrPhone: string, password: string) {
    return this.authService.signIn(emailOrPhone, password);
  }

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(@Body() body: { refreshToken: string }) {
    if (!body.refreshToken) {
      throw new NotImplementedException('Refresh token is required');
    }
    return this.authService.refreshAccessToken(body.refreshToken);
  }
}


