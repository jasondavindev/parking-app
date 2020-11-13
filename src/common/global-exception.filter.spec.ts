import {
  ArgumentsHost,
  HttpStatus,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import loggerConfig from './logger.config';
import { GlobalExceptionFilter } from './global-exception.filter';

describe('HttpExceptionFilter', () => {
  const request = {
    url: String,
  };

  const response = {
    statusMessage: String,
    body: Object,
    status(status) {
      this.statusMessage = status;
      return this;
    },
    json(json) {
      this.body = json;
      return this;
    },
  };

  const httpArgumentsHost = {
    getResponse: () => response,
    getRequest: () => request,
  } as HttpArgumentsHost;

  const argumentHost = {
    switchToHttp: () => httpArgumentsHost,
  } as ArgumentsHost;

  const logger = new PinoLogger(loggerConfig);
  const httpExceptionFilter = new GlobalExceptionFilter(logger);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should returns internal server error', () => {
    const error = new Error();
    httpExceptionFilter.catch(error, argumentHost);

    expect(response.statusMessage).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it('should returns conflict', () => {
    const error = new ConflictException();
    httpExceptionFilter.catch(error, argumentHost);

    expect(response.statusMessage).toEqual(HttpStatus.CONFLICT);
  });

  it('should returns bad request', () => {
    const error = new BadRequestException();
    httpExceptionFilter.catch(error, argumentHost);

    expect(response.statusMessage).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('should returns not found', () => {
    const error = new NotFoundException();
    httpExceptionFilter.catch(error, argumentHost);

    expect(response.statusMessage).toEqual(HttpStatus.NOT_FOUND);
  });
});
