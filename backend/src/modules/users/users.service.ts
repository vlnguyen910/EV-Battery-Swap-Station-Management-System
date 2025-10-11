import { BadRequestException, ConflictException, Injectable, UseGuards } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { normalizeEmail, normalizePhone } from 'src/shared/utils/normalization.util';
import { hashPassword } from 'src/shared/utils/hash-password.util';
import { emit } from 'process';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { $Enums } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(AuthGuard, RolesGuard)
@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) { }

  @Roles($Enums.Role.admin)
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

    const newUser = await this.databaseService.user.create({
      data: {
        username,
        password: hashedPassword,
        email: normalizedEmail,
        phone: normalizedPhone,
        role: role,
      },
    });

    return newUser;
  }

  async findAll() {
    return await this.databaseService.user.findMany();
  }

  async findOneById(user_id: number) {
    return this.databaseService.user.findUnique({
      where: { user_id }
    });
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

  async update(id: number, updateUserDto: UpdateUserDto) {
    return "This action updates a #${id} user";
  }

  async remove(id: number) {
    return "This action removes a #${id} user";
  }
}
