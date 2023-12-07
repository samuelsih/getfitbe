import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ImageRepository } from './image.repository';

@Module({
  providers: [ImageService, ImageRepository],
  controllers: [ImageController],
  exports: [ImageService],
  imports: [
    NestjsFormDataModule.config({ storage: MemoryStoredFile }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          global: true,
          secret: config.get('JWT_SECRET'),
        };
      },
    }),
  ],
})
export class ImageModule {}
