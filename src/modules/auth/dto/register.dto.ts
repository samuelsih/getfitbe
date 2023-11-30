import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

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

  @IsOptional()
  @IsFile()
  @MaxFileSize(5e6)
  @HasMimeType(['image/jpeg', 'image/png', 'image/jpg'])
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  avatar: MemoryStoredFile;
}
