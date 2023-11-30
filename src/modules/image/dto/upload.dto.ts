import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export class UploadImageDTO {
  @IsOptional()
  @IsFile()
  @MaxFileSize(5e6)
  @HasMimeType(['image/jpeg', 'image/png', 'image/jpg'])
  @ApiProperty({ type: 'string', format: 'binary' })
  image: MemoryStoredFile;
}
