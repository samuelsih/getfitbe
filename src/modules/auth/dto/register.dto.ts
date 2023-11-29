import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class RegisterRequestDTO {
  @IsString()
  @IsNotEmpty()
  @IsAlpha()
  @Length(4)
  @ApiProperty({ example: 'Seseorang' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'mail@example.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8)
  @ApiProperty({ example: 'user1234' })
  password: string;
}
