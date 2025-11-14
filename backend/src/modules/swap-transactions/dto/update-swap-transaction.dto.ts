import { PartialType } from '@nestjs/mapped-types';
import { CreateSwapTransactionDto } from './create-swap-transaction.dto';
import { SwapTransactionStatus } from '@prisma/client';
import { IsNotEmpty, IsEnum } from 'class-validator';

export class UpdateSwapTransactionDto extends PartialType(CreateSwapTransactionDto) {
}
