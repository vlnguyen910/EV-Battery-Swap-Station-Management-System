import { ArrayMinSize, IsArray, IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { TicketType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBatteryTransferTicketDto {
    @ApiProperty({ type: Number, description: 'ID of the transfer request associated with the ticket', example: 1 })
    @IsNotEmpty()
    @IsInt()
    transfer_request_id: number;

    @ApiProperty({ enum: TicketType, description: 'Type of the ticket', example: TicketType.import })
    @IsNotEmpty()
    @IsEnum(TicketType)
    ticket_type: TicketType;

    @ApiProperty({ type: Number, description: 'ID of the station where the ticket is created', example: 1 })
    @IsNotEmpty()
    @IsInt()
    station_id: number;

    @ApiProperty({ type: Number, description: 'ID of the staff creating the ticket', example: 1 })
    @IsNotEmpty()
    @IsInt()
    staff_id: number;

    @IsArray()
    @ArrayMinSize(1, { message: 'At least one battery must be selected' })
    @IsInt({ each: true })
    battery_ids: number[];
}
