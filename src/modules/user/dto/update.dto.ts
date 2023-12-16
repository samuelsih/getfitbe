import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsOptional, IsString, Length } from 'class-validator';

export class UpdateDTO {
  @IsOptional()
  @IsString()
  @IsAlpha()
  @Length(4)
  @ApiProperty({ example: 'Seseorang' })
  name: string;

  @IsOptional()
  @IsString()
  @Length(4)
  @ApiProperty({ example: 'Satpol' })
  bio: string;
}
