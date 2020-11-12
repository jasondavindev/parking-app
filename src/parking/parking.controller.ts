import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ParkingService } from './parking.service';
import { ParkingDto } from './dto/parking.dto';
import { Parking } from './schemas/parking.schema';

@Controller('/v1/parking')
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  @Post()
  async create(@Body() createParkingDto: ParkingDto) {
    await this.parkingService.create(createParkingDto);
  }

  @Get('/:plate')
  async findPlateHistory(@Param('plate') plate: string): Promise<Parking[]> {
    return this.parkingService.findByPlate(plate);
  }

  @Put('/:uuid/pay')
  @HttpCode(HttpStatus.NO_CONTENT)
  async payPark(@Param('uuid') uuid: string) {
    await this.parkingService.payParking(uuid);
  }

  @Put('/:uuid/out')
  @HttpCode(HttpStatus.NO_CONTENT)
  async outPark(@Param('uuid') uuid: string) {
    await this.parkingService.checkout(uuid);
  }
}
