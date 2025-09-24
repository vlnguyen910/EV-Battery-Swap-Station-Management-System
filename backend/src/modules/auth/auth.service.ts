import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginResponse } from './interfaces/LoginRespone.interface';
import { isMatchPassword } from 'src/shared/utils/hash-password.util';
import { JwtService } from '@nestjs/jwt';

type AuthInput = {
    emailOrPhone: string;
    password: string;
}

type AuthResult = {
    accessToken: string;
}

type SignInData = {
    user: {
        id: number;
        email: string;
        phone: string;
        name: string;
        role: string;
    }
}

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) { }

    async authenticate(input: AuthInput): Promise<AuthResult> {
        const user = await this.validateUser(input);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.signIn(user);
    }

    async validateUser(input: AuthInput): Promise<SignInData | null> {
        if (!input) {
            return null;
        }

        const user = await this.usersService.findOneByEmailOrPhone(input.emailOrPhone);

        if (user && await isMatchPassword(input.password, user.password)) {
            return {
                user: {
                    id: user.user_id,
                    email: user.email,
                    phone: user.phone,
                    name: user.username,
                    role: user.role,
                }
            };
        }

        return null;
    }

    async signIn(user: SignInData): Promise<AuthResult> {
        const tokenPayload = {
            sub: user.user.id,
            userId: user.user.id,
            email: user.user.email,
            role: user.user.role,
            username: user.user.name,
        }

        const accessToken = await this.jwtService.signAsync(tokenPayload);

        return {
            accessToken
        }
    }
}

