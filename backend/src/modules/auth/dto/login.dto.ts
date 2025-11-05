import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
    @IsNotEmpty({ message: 'Email or phone is required' })
    emailOrPhone: string

    @IsNotEmpty({ message: 'Password is required' })
    password: string
}