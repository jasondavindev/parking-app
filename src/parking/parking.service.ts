import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ParkingDto } from './dto/parking.dto';
import { Parking } from './schemas/parking.schema';

@Injectable()
export class ParkingService {
  constructor(
    @InjectModel(Parking.name) private readonly parkModel: Model<Parking>,
  ) {}

  async create(createParkingDto: ParkingDto): Promise<Parking> {
    const createdCat = new this.parkModel(createParkingDto);
    return createdCat.save();
  }

  async findAll(): Promise<Parking[]> {
    return this.parkModel.find().exec();
  }
}
