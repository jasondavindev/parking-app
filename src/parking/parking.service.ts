import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ParkCreateDto } from './dto/parking-create.dto';
import { Parking } from './schemas/parking.schema';
import { ParkingNotPaidError } from './errors/parking_not_paid.error';
import { ParkingNotFoundError } from './errors/parking_not_found.error';
import { AlreadyParkedError } from './errors/already_parked.error';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class ParkingService {
  constructor(
    @InjectModel(Parking.name) private readonly parkingModel: Model<Parking>,
    private readonly logger: PinoLogger,
  ) {}

  async create(createParkingDto: ParkCreateDto): Promise<Parking> {
    await this.throwsIfIsInParking(createParkingDto.plate);

    const createdParkingTicket = new this.parkingModel(createParkingDto);
    return createdParkingTicket.save();
  }

  async findByPlate(plate: string): Promise<Parking[]> {
    return this.parkingModel
      .find({ plate }, { _id: 0, __v: 0 })
      .sort({ createdAt: -1 });
  }

  async pay(uuid: string): Promise<Parking> {
    const parkingTicket = await this.findOneOrThrow({ uuid } as Parking);
    parkingTicket.paid = true;
    return parkingTicket.save();
  }

  async getOut(uuid: string): Promise<Parking> {
    const parkingTicket = await this.findOneOrThrow({ uuid } as Parking);
    this.checkIfIsPaidOrThrow(parkingTicket);

    parkingTicket.left = true;

    await parkingTicket.save();

    return parkingTicket;
  }

  async findOneOrThrow(options: Parking) {
    const parkTicker = await this.parkingModel.findOne(options);

    if (!parkTicker) throw new ParkingNotFoundError();

    return parkTicker;
  }

  private checkIfIsPaidOrThrow(parking: Parking) {
    if (!parking.paid) {
      this.logger.error(
        `ParkingService#checkIfIsPaidOrThrow - Parking uuid=${parking.uuid}`,
      );
      throw new ParkingNotPaidError();
    }
  }

  private async throwsIfIsInParking(plate: string): Promise<void> {
    const isInParking = await this.checkIfAlreadyIsInParking(plate);

    if (isInParking) {
      this.logger.error(
        `ParkingService#throwsIfIsInParking - Try to create new parking ticket plate=(${plate})`,
      );
      throw new AlreadyParkedError();
    }
  }

  private async checkIfAlreadyIsInParking(plate: string): Promise<boolean> {
    const [park] = await this.parkingModel
      .find({ plate })
      .sort({ createdAt: -1 })
      .limit(1);

    return park?.left === false;
  }
}
