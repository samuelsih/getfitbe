import { NestFactory } from '@nestjs/core';
import { AppModule } from '#/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { customValidationPipe } from './config';
import { AllExceptionFilter } from './exception/all.filter';
import { ConfigService } from '@nestjs/config';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(customValidationPipe);
  app.useGlobalFilters(new AllExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Getfit API')
    .setDescription('The Getfit API playground')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = app.get(ConfigService).get<number>('APP_PORT');
  await app.listen(port);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
