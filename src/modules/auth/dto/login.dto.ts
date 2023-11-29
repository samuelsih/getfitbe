import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginRequestDTO {
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

export class LoginResultDTO {
  @ApiProperty({ example: 'mail@example.com' })
  email: string;

  @ApiProperty({ example: '6f056614-ac7a-4932-862a-ebe72a8544e7' })
  id: string;

  @ApiProperty()
  image?: string;

  @ApiProperty({ example: 'Seseorang' })
  name: string;

  @ApiProperty({ example: 'USER' })
  role: 'TRAINER' | 'USER';

  @ApiProperty({ example: '2023-11-28T14:07:15.863Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-11-28T14:07:15.863Z' })
  updatedAt: Date;
}
