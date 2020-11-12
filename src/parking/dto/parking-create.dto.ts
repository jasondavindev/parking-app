import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ParkCreateDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{3}-[0-9]{4}$/, {
    message: 'Invalid plate',
  })
  @ApiProperty({
    example: 'ABC-1234',
    description: 'The car plate',
  })
  readonly plate: string;
}
