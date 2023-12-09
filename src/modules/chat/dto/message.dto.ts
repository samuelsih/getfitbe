import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '7bbb5388-9b01-458b-9bd3-42d35375d46c' })
  conversation_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Saya satpol' })
  message: string;
}
