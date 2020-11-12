import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { DatabaseModule } from './database/database.module';
import { ParkingModule } from './parking/parking.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [TerminusModule, DatabaseModule, ParkingModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
