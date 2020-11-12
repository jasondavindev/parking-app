import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/global_error_handler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app
    .useGlobalPipes(new ValidationPipe({ transform: true }))
    .useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
