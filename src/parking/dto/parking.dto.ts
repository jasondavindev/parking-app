import { Matches } from 'class-validator';

export class ParkingDto {
  @Matches(/^[A-Z]{3}-[0-9]{4}$/, {
    message: 'Invalid plate',
  })
  readonly plate: string;
}
