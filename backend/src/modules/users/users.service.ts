import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { normalizeEmail, normalizePhone } from 'src/shared/utils/normalization.util';
import { hashPassword } from 'src/shared/utils/hash-password.util';
import { $Enums } from '@prisma/client';
import { UpdateEmailTokenDto } from "./dto/update-email-token.dto";

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createUserDto: CreateUserDto) {
    const { username, password, email, phone, role } = createUserDto;

    if (!email || !phone) {
      throw new BadRequestException('Email and phone number are required');
    }

    const normalizedEmail = normalizeEmail(email);
    const normalizedPhone = normalizePhone(phone);

    const existingEmailUser = await this.databaseService.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existingEmailUser) {
      throw new ConflictException('Email already in use');
    }

    const existingPhoneUser = await this.databaseService.user.findUnique({
      where: { phone: normalizedPhone },
    });
    if (existingPhoneUser) {
      throw new ConflictException('Phone number already in use');
    }

    const hashedPassword = hashPassword(password);

    const emailVerified = role === $Enums.Role.driver ? false : true;

    const newUser = await this.databaseService.user.create({
      data: {
        username,
        password: hashedPassword,
        email: normalizedEmail,
        phone: normalizedPhone,
        email_verified: emailVerified,
        email_token: createUserDto.email_token,
        email_token_expires: createUserDto.email_token_expires,
        role: role,
      },
    });

    return {
      user: {
        user_id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      }
    }
  }

  async createGoogleUser(data: { email: string; username: string; role: $Enums.Role }) {
    const normalizedEmail = normalizeEmail(data.email);

    // Check if email already exists
    const existingUser = await this.databaseService.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Generate random phone for Google users (they can update later)
    const randomPhone = `GOOGLE_${Date.now()}`;

    // Create user without password (Google OAuth)
    const newUser = await this.databaseService.user.create({
      data: {
        username: data.username,
        password: '', // Empty password for Google users
        email: normalizedEmail,
        phone: randomPhone,
        role: data.role,
      },
    });

    return newUser;
  }

  async findAll() {
    return await this.databaseService.user.findMany();
  }

  async findOneById(user_id: number) {
    const user = await this.databaseService.user.findUnique({
      where: { user_id }
    });

    if (!user) {
      throw new NotFoundException(`User with ID: ${user_id} not found `);
    }

    return user;
  }

  async findOneByEmailOrPhone(emailOrPhone: string) {
    const isEmail = emailOrPhone.includes('@');

    if (isEmail) {
      return this.databaseService.user.findUnique({
        where: { email: normalizeEmail(emailOrPhone) }
      });
    }
    return this.databaseService.user.findUnique({
      where: { phone: normalizePhone(emailOrPhone) }
    });
  }

  async findOneByEmail(email: string) {
    const user = await this.databaseService.user.findUnique({
      where: { email: normalizeEmail(email) },
      select: {
        user_id: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        email_verified: true,
        email_token: true,
        email_token_expires: true,
      }
    });

    return user;
  }

  async findOneByEmailToken(emailToken: string) {
    const user = await this.databaseService.user.findFirst({
      where: { email_token: emailToken }
    });

    if (!user) {
      throw new BadRequestException('Verification token is invalid');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.databaseService.user.update({
      where: { user_id: id },
      data: updateUserDto,
    });

    return updatedUser;
  }

  async markEmailAsVerified(user_id: number) {
    const verifiedUser = await this.databaseService.user.update({
      where: { user_id },
      data: {
        email_verified: true,
        email_token: null,
        email_token_expires: null,
      },
      select: {
        user_id: true,
        username: true,
        email: true,
        email_verified: true,
      }
    });

    return verifiedUser;
  }

  async updateEmailToken(user_id: number, dto: UpdateEmailTokenDto) {
    await this.databaseService.user.update({
      where: { user_id },
      data: {
        email_token: dto.email_token,
        email_token_expires: dto.email_token_expires,
      },
    });
  }

  async updateRefreshToken(user_id: number, refreshToken: string) {
    await this.databaseService.user.update({
      where: { user_id },
      data: { refresh_token: refreshToken },
    });
  }

  async remove(id: number) {
    return "This action removes a #${id} user";
  }
}
