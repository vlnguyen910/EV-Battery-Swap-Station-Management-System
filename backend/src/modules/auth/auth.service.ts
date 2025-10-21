import { Injectable, NotImplementedException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { isMatchPassword } from 'src/shared/utils/hash-password.util';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) { }

    async signIn(emailOrPhone: string, password: string) {
        if (!emailOrPhone || !password) {
            throw new NotImplementedException('Email/Phone and password are required');
        }

        const user = await this.usersService.findOneByEmailOrPhone(emailOrPhone);


        if (!user || !(await isMatchPassword(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const tokenPayload = {
            sub: user.user_id,
            email: user.email,
            phone: user.phone,
            username: user.username,
            role: user.role,
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

    async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
        const payload = await this.jwtService.verifyAsync(refreshToken, {
            secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        });

        const user = await this.usersService.findOneById(payload.sub);
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

    async register(dto: CreateUserDto) {
        const newUser = await this.usersService.create({
            username: dto.username,
            password: dto.password,
            email: dto.email,
            phone: dto.phone,
            role: Role.driver,
        });

        return newUser;
    }
}

