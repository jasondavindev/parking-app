import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ParkCreateDto } from './dto/parking-create.dto';
import { Parking } from './schemas/parking.schema';
import { v4 as uuidV4 } from 'uuid';
import { ParkingNotPaidError } from './error/parking_not_paid_error';

@Injectable()
export class ParkingService {
  constructor(
    @InjectModel(Parking.name) private readonly parkModel: Model<Parking>,
  ) {}

  async create(createParkingDto: ParkCreateDto): Promise<Parking> {
    const createdPark = new this.parkModel(createParkingDto);
    createdPark.uuid = uuidV4();
    return createdPark.save();
  }

  async findByPlate(plate: string): Promise<Parking[]> {
    return this.parkModel
      .find({ plate }, { _id: 0, __v: 0 })
      .sort({ createdAt: -1 });
  }

  async payParking(uuid: string): Promise<Parking> {
    return this.parkModel.updateOne(
      { uuid },
      {
        paid: true,
      },
    );
  }

  async checkout(uuid: string): Promise<Parking> {
    const park = await this.parkModel.findOne({ uuid });
    this.checkIfIsPaidOrThrow(park);
    this.leaveParking(park);

    await park.save();

    return park;
  }

  private leaveParking(park: Parking): Parking {
    park.left = true;
    return park;
  }

  private checkIfIsPaidOrThrow(park: Parking) {
    if (!park?.paid) {
      throw new ParkingNotPaidError();
    }
  }
}
