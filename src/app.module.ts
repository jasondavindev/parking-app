import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { ParkingModule } from './parking/parking.module';
import { HealthController } from './health/health.controller';
import { MongooseModule } from '@nestjs/mongoose';
import loggerConfig from './common/logger.config';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot(loggerConfig),
    MongooseModule.forRoot(process.env.MONGO_URI),
    TerminusModule,
    ParkingModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
