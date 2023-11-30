import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { KyselyModule } from 'nestjs-kysely';
import { PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { WinstonModule } from 'nest-winston';
import { setupLogger } from '#/logger/logger';
import { AuthModule } from '#/modules/auth/auth.module';
import { MinioModule } from 'nestjs-minio-client';
import { ImageModule } from './modules/image/image.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_ISSUER: Joi.string().required(),
        JWT_REFRESH: Joi.string().required(),
        APP_PORT: Joi.number().required(),
        ENVIRONMENT: Joi.string().default('PROD'),
        MINIO_ENDPOINT: Joi.string().required(),
        MINIO_PORT: Joi.number().required(),
        MINIO_ACCESS_KEY: Joi.string().required(),
        MINIO_SECRET_KEY: Joi.string().required(),
        MINIO_BUCKET_IMG: Joi.string().required(),
      }),
      validationOptions: {
        abortEarly: true,
      },
    }),
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logger = setupLogger(
          configService.get('ENVIRONMENT'),
          'getfit-api',
          configService.get('TELEGRAM_TOKEN'),
          configService.get('TELEGRAM_CHANNEL'),
        );

        return logger;
      },
    }),
    KyselyModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dialect = new PostgresDialect({
          pool: new Pool({
            host: configService.get('POSTGRES_HOST'),
            port: configService.get('POSTGRES_PORT'),
            user: configService.get('POSTGRES_USER'),
            password: configService.get('POSTGRES_PASSWORD'),
            database: configService.get('POSTGRES_DB'),
          }),
        });

        return { dialect };
      },
    }),
    MinioModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          endPoint: configService.get('MINIO_ENDPOINT'),
          port: configService.get<number>('MINIO_PORT'),
          useSSL: false,
          accessKey: configService.get('MINIO_ACCESS_KEY'),
          secretKey: configService.get('MINIO_SECRET_KEY'),
        };
      },
    }),
    AuthModule,
    ImageModule,
  ],
})
export class AppModule {}
