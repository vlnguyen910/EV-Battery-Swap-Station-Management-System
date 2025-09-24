import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { isMatchPassword } from 'src/shared/utils/hash-password.util';
import { JwtService } from '@nestjs/jwt';

type AuthInput = {
    emailOrPhone: string;
    password: string;
}

type AuthResult = {
    accessToken: string;
    refreshToken: string;
}

type SignInData = {
    id: number;
    email: string;
    phone: string;
    name: string;
    role: string;
}

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) { }

    async signIn(input: AuthInput): Promise<AuthResult> {
        const user = await this.validateUser(input);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const tokenPayload = {
            sub: user.id,
            email: user.email,
            phone: user.phone,
            role: user.role,
            username: user.name,
        }

        const accessToken = await this.jwtService.signAsync(tokenPayload);
        const refreshToken = await this.jwtService.signAsync(tokenPayload, {
            secret: process.env.JWT_REFRESH_TOKEN_SECRET,
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
        });
        return {
            accessToken,
            refreshToken
        }
    }

    async validateUser(input: AuthInput): Promise<SignInData | null> {
        if (!input) {
            return null;
        }

        const user = await this.usersService.findOneByEmailOrPhone(input.emailOrPhone);

        if (user && await isMatchPassword(input.password, user.password)) {
            return {
                id: user.user_id,
                email: user.email,
                phone: user.phone,
                name: user.username,
                role: user.role,
            };
        }

        return null;
    }

    async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
        const payload = await this.jwtService.verifyAsync(refreshToken, {
            secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        });

        const user = await this.usersService.findOne(payload.sub);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const newTokenPayload = {
            sub: user.user_id,
            name: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role
        };

        const newAccessToken = await this.jwtService.signAsync(newTokenPayload, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        return { accessToken: newAccessToken };
    }
}

