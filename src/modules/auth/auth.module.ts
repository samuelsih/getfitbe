import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { MessagingService } from '../chat/messaging.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
  imports: [
    MessagingService,
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
export class AuthModule {}
