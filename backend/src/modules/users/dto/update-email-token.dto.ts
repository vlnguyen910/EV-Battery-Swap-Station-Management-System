import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class UpdateEmailTokenDto {
    @IsNotEmpty()
    @IsString()
    email_token: string;

    @IsNotEmpty()
    @IsDate()
    email_token_expires: Date;
}