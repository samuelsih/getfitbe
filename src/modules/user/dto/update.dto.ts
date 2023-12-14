import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlpha,
  IsAlphanumeric,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateDTO {
  @IsOptional()
  @IsString()
  @IsAlpha()
  @Length(4)
  @ApiProperty({ example: 'Seseorang' })
  name: string;

  @IsOptional()
  @IsString()
  @IsAlphanumeric()
  @Length(4)
  @ApiProperty({ example: 'Satpol' })
  bio: string;
}
