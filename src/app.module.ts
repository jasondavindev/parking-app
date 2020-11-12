import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { ParkingModule } from './parking/parking.module';
import { HealthController } from './health/health.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    TerminusModule,
    ParkingModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
