import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://user_app:password@localhost:5000/park_db',
    ),
  ],
})
export class DatabaseModule {}
