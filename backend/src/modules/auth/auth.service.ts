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
    user: {
        id: number;
        email: string;
        phone: string;
        name: string;
        role: string;
    }
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

        return {
            accessToken: "fake-jwt-token",
            user: {
                id: user.user.id,
                email: user.user.email,
                phone: user.user.phone,
                name: user.user.name,
                role: user.user.role,
            }
        }
    }

    async validateUser(input: AuthInput): Promise<SignInData | null> {
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
}

