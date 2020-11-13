import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ParkingService } from '../src/parking/parking.service';
import * as request from 'supertest';
import { ParkingModule } from '../src/parking/parking.module';
import {
  cleanUp,
  closeInMongodConnection,
  rootMongooseTestModule,
} from './db-test-setup';
import { LoggerModule } from 'nestjs-pino';
import loggerConfig from '../src/common/logger.config';

describe('ParkingController (e2e)', () => {
  const path = '/v1/parking';
  let server;
  let app: INestApplication;
  let parkingService: ParkingService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        LoggerModule.forRoot(loggerConfig),
        ParkingModule,
      ],
    }).compile();

    app = module.createNestApplication();
    server = app.getHttpServer();
    await app.init();
    parkingService = module.get<ParkingService>(ParkingService);
  });

  it('should create a parking ticket', () => {
    const parking = { plate: 'ABC-2234' };

    return request(server)
      .post(path)
      .send(parking)
      .expect(HttpStatus.CREATED)
      .expect((response: request.Response) => {
        expect(response.body).toHaveProperty('uuid');
      });
  });

  it('should return Conflict error when already exists a record that is in the parking', async () => {
    const parking = { plate: 'ABC-2234' };

    await parkingService.create(parking);

    return request(server).post(path).send(parking).expect(HttpStatus.CONFLICT);
  });

  it('should return the parking ticket', async () => {
    const parking = { plate: 'ABC-2234' };

    await parkingService.create(parking);

    return request(server)
      .get(`${path}/${parking.plate}`)
      .expect(HttpStatus.OK)
      .expect((response: request.Response) => {
        expect(response.body).toHaveLength(1);
        expect(response.body[0]).toHaveProperty('uuid');
        expect(response.body[0].plate).toEqual(parking.plate);
      });
  });

  it('should update payment status', async () => {
    const parking = await parkingService.create({ plate: 'ABC-2234' });

    return request(server)
      .put(`${path}/${parking.uuid}/pay`)
      .expect(HttpStatus.NO_CONTENT);
  });

  it('should return Not found when parking ticket not exists', async () => {
    return request(server)
      .put(`${path}/random-uuid/pay`)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('should update "left" status', async () => {
    const parking = await parkingService.create({ plate: 'ABC-2234' });
    await parkingService.pay(parking.uuid);

    return request(server)
      .put(`${path}/${parking.uuid}/out`)
      .expect(HttpStatus.NO_CONTENT);
  });

  it('should return CONFLICT error when parking ticket is not paid', async () => {
    const parking = await parkingService.create({ plate: 'ABC-2234' });

    return request(server)
      .put(`${path}/${parking.uuid}/out`)
      .expect(HttpStatus.CONFLICT);
  });

  afterEach(async () => {
    await cleanUp();
  });

  afterAll(async () => {
    await closeInMongodConnection();
    await app.close();
  });
});
