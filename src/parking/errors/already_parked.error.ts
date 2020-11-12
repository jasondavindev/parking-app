import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyParkedError extends HttpException {
  constructor() {
    super('Parking already parked', HttpStatus.CONFLICT);
  }
}
