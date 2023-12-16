import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateDTO {
  @IsOptional()
  @IsString()
  @Length(4)
  @ApiProperty({ example: 'Seseorang' })
  name: string;

  @IsOptional()
  @IsString()
  @Length(4)
  @ApiProperty({ example: 'Satpol' })
  bio: string;
}
