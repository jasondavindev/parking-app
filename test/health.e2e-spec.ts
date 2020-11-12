import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

dotenvConfig({ path: '.env' });

describe('HealthController (e2e)', () => {
  const path = '/health';
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  it('should return status OK', () => {
    return request(app.getHttpServer())
      .get(path)
      .expect(HttpStatus.OK)
      .expect((response: request.Response) => {
        expect(response.body.status).toEqual('ok');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
