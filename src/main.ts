import { NestFactory } from '@nestjs/core';
import { AppModule } from '#/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { customValidationPipe } from './config';
import { HttpExceptionFilter } from './exception/http.filter';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { setupLoggerModule } from './logger/logger';
import { customCSS } from './swagger/swaggerDark';
import { AllFilter } from './exception/all.filter';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const loggerModule = setupLoggerModule(
    config.get('ENVIRONMENT'),
    'getfit-api',
    config.get('TELEGRAM_TOKEN'),
    config.get('TELEGRAM_CHANNEL'),
  );

  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.use(helmet());

  app.useGlobalPipes(customValidationPipe);
  app.useGlobalFilters(new HttpExceptionFilter(loggerModule));
  app.useGlobalFilters(new AllFilter(loggerModule));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Getfit API')
    .setDescription('The Getfit API playground')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    customCss: customCSS(),
  });

  await app.listen(config.get('APP_PORT'));

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
