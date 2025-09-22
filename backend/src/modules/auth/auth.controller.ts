import {
  Controller,
  HttpStatus,
  NotImplementedException,
  Post,
  HttpCode,
  Body
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() input: { emailOrPhone: string; password: string }) {
    return this.authService.authenticate(input);
  }
}

