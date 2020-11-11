import { Body, Controller, Get, Post } from '@nestjs/common';
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

  @Get()
  async findAll(): Promise<Parking[]> {
    return this.parkingService.findAll();
  }
}
