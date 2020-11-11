import { resolve } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ParkingModule } from './parking/parking.module';

const configFilePath = resolve(__dirname, '..', '.env');

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: configFilePath, isGlobal: true }),
    DatabaseModule,
    ParkingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
