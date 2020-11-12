import { HttpException, HttpStatus } from '@nestjs/common';

export class ParkingNotPaidError extends HttpException {
  constructor() {
    super('Parking has not yet been paid', HttpStatus.CONFLICT);
  }
}
