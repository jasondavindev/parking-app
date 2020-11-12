import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';

@Schema({
  timestamps: true,
})
export class Parking extends Document {
  constructor() {
    super();
    this.uuid = uuidV4();
    this.left = false;
    this.paid = false;
  }

  @Prop()
  plate: string;

  @Prop()
  uuid: string;

  @Prop()
  time: string;

  @Prop()
  paid: boolean;

  @Prop()
  left: boolean;
}

export const ParkingSchema = SchemaFactory.createForClass(Parking);
