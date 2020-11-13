import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

import * as helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/global-exception.filter';
import swaggerConfigure from './common/swagger.config';
import { Logger } from 'nestjs-pino';

const { PORT = 3000 } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app
    .useGlobalPipes(new ValidationPipe({ transform: true }))
    .useGlobalFilters(new GlobalExceptionFilter(app.get(Logger)));

  swaggerConfigure(app);

  await app.listen(PORT);
}
bootstrap();
