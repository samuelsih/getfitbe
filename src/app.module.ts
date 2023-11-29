import { Module } from '@nestjs/common';
import { AuthModule } from '#/domain/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { KyselyModule } from 'nestjs-kysely';
import { PostgresDialect } from 'kysely';
import { Pool } from 'pg';

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
        APP_PORT: Joi.number().required(),
      }),
      validationOptions: {
        abortEarly: true,
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

        console.table({
          host: configService.get('POSTGRES_HOST'),
          port: configService.get('POSTGRES_PORT'),
          user: configService.get('POSTGRES_USER'),
          password: configService.get('POSTGRES_PASSWORD'),
          database: configService.get('POSTGRES_DB'),
        });

        return { dialect };
      },
    }),
    AuthModule,
  ],
})
export class AppModule {}
