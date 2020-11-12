import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

import * as helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/http-exception.filter';
import swaggerConfigure from './common/swagger.config';

const { PORT = 3000 } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app
    .useGlobalPipes(new ValidationPipe({ transform: true }))
    .useGlobalFilters(new HttpExceptionFilter());

  swaggerConfigure(app);

  await app.listen(PORT);
}
bootstrap();
