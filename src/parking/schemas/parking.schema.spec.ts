import * as mongoose from 'mongoose';
import { Parking, ParkingSchema } from './parking.schema';

describe('Parking (schema)', () => {
  it('should dynamically fill the time field', async () => {
    const createdAtTime = new Date('01/01/2020');
    const currentTime = new Date('01/01/2020');
    currentTime.setMinutes(10);

    jest
      .spyOn(global.Date.prototype, 'getTime')
      .mockReturnValueOnce(currentTime.getTime());

    const parkingModel = mongoose.model(Parking.name, ParkingSchema);
    const parking = new parkingModel({ createdAt: createdAtTime });

    expect(parking.toJSON().time).toEqual('10 minutes');
  });
});
