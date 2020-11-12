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
import { ParkCreateDto } from './dto/parking-create.dto';
import { Parking } from './schemas/parking.schema';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ParkingResponseDto } from './dto/parking-response.dto';

@ApiTags('Parking')
@Controller('/v1/parking')
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Parking ticket created',
    type: ParkingResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid plate',
  })
  @ApiConflictResponse({
    description: 'Parking already parked',
  })
  @ApiOperation({
    summary: 'Create a new parking ticket',
  })
  async create(@Body() parkDto: ParkCreateDto): Promise<ParkingResponseDto> {
    return this.parkingService.create(parkDto);
  }

  @Get('/:plate')
  @ApiOkResponse({
    description: 'Parking records',
    type: [ParkingResponseDto],
  })
  @ApiOperation({
    summary: 'Retrieve parking tickets',
  })
  @ApiParam({
    name: 'plate',
    description: 'The car plate',
    example: 'ABC-1234',
  })
  async findPlateHistory(@Param('plate') plate: string): Promise<Parking[]> {
    return this.parkingService.findByPlate(plate);
  }

  @Put('/:uuid/pay')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Pay the parking',
  })
  @ApiNoContentResponse({
    description: 'Parking paid',
  })
  @ApiNotFoundResponse({
    description: 'Parking ticket not found',
  })
  @ApiParam({ name: 'uuid', description: 'Record uuid' })
  async payPark(@Param('uuid') uuid: string) {
    await this.parkingService.pay(uuid);
  }

  @Put('/:uuid/out')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Get out of the parking',
  })
  @ApiNoContentResponse({
    description: 'Left parking',
  })
  @ApiNotFoundResponse({
    description: 'Parking ticket not found',
  })
  @ApiParam({ name: 'uuid', description: 'Record uuid' })
  async outPark(@Param('uuid') uuid: string) {
    await this.parkingService.checkout(uuid);
  }
}
