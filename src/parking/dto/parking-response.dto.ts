import { ApiProperty } from '@nestjs/swagger';

export class ParkingResponseDto {
  @ApiProperty({
    description: 'Uuid identifier',
  })
  readonly uuid: string;

  @ApiProperty({
    description: 'The car plate',
    example: 'ABC-1234',
  })
  readonly plate: string;

  @ApiProperty({ description: "If it's out", default: false })
  readonly left: boolean;

  @ApiProperty({ description: "If it's paid", default: false })
  readonly paid: boolean;

  @ApiProperty({
    description: 'Parking time',
    example: '10 minutes',
  })
  readonly time: string;
}
