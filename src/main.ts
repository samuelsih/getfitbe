import { NestFactory } from '@nestjs/core';
import { AppModule } from '#/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { customValidationPipe } from './config';
import { AllExceptionFilter } from './exception/all.filter';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { setupLoggerModule } from './logger/logger';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS'],
  });
  app.use(helmet());

  app.useGlobalPipes(customValidationPipe);
  app.useGlobalFilters(
    new AllExceptionFilter(
      setupLoggerModule(
        config.get('ENVIRONMENT'),
        'getfit-api',
        config.get('TELEGRAM_TOKEN'),
        config.get('TELEGRAM_CHANNEL'),
      ),
    ),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Getfit API')
    .setDescription('The Getfit API playground')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(config.get('APP_PORT'));

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
