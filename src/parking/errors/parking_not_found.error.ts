import { HttpException, HttpStatus } from '@nestjs/common';

export class ParkingNotFoundError extends HttpException {
  constructor() {
    super('Parking ticket not found', HttpStatus.NOT_FOUND);
  }
}
