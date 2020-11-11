import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Parking extends Document {
  @Prop()
  time: string;

  @Prop()
  paid: boolean;

  @Prop()
  left: boolean;
}

export const ParkingSchema = SchemaFactory.createForClass(Parking);
