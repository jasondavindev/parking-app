import { Parking } from 'src/parking/schemas/parking.schema';

export const validParkingMock = {
  plate: 'ABC-1234',
  uuid: '27f9be19-0a70-429e-b879-d97e7ee636ec',
  paid: false,
  left: false,
  createdAt: new Date(),
} as Parking;
