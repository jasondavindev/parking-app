import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ParkCreateDto } from './dto/parking-create.dto';
import { Parking } from './schemas/parking.schema';
import { ParkingNotPaidError } from './errors/parking_not_paid.error';
import { ParkingNotFoundError } from './errors/parking_not_found.error';
import { AlreadyParkedError } from './errors/already_parked.error';

@Injectable()
export class ParkingService {
  constructor(
    @InjectModel(Parking.name) private readonly parkingModel: Model<Parking>,
  ) {}

  async create(createParkingDto: ParkCreateDto): Promise<Parking> {
    await this.throwsIfIsInParking(createParkingDto.plate);

    const createdPark = new this.parkingModel(createParkingDto);
    return createdPark.save();
  }

  async findByPlate(plate: string): Promise<Parking[]> {
    return this.parkingModel
      .find({ plate }, { _id: 0, __v: 0 })
      .sort({ createdAt: -1 });
  }

  async pay(uuid: string): Promise<Parking> {
    const park = await this.findOneOrThrow({ uuid } as Parking);
    park.paid = true;
    return park.save();
  }

  async getOut(uuid: string): Promise<Parking> {
    const park = await this.findOneOrThrow({ uuid } as Parking);
    this.checkIfIsPaidOrThrow(park);

    park.left = true;

    await park.save();

    return park;
  }

  async findOneOrThrow(options: Parking) {
    const park = await this.parkingModel.findOne(options);

    if (!park) throw new ParkingNotFoundError();

    return park;
  }

  private checkIfIsPaidOrThrow(park: Parking) {
    if (!park?.paid) {
      throw new ParkingNotPaidError();
    }
  }

  private async throwsIfIsInParking(plate: string): Promise<void> {
    const isInParking = await this.checkIfAlreadyIsInParking(plate);

    if (isInParking) throw new AlreadyParkedError();
  }

  private async checkIfAlreadyIsInParking(plate: string): Promise<boolean> {
    const [park] = await this.parkingModel
      .find({ plate })
      .sort({ createdAt: -1 })
      .limit(1);

    return park?.left === false;
  }
}
