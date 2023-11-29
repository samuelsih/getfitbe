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
  email: string;
  id: string;
  image: string;
  name: string;
  role: 'TRAINER' | 'USER';
  createdAt: Date;
  updatedAt: Date;
}
