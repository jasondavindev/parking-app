import { Schema, Document } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';

export class Parking extends Document {
  readonly plate: string;
  readonly uuid: string;
  readonly time: string;
  paid: boolean;
  left: boolean;
}

export const ParkingSchema = new Schema(
  {
    plate: String,
    uuid: { type: String, default: uuidV4() },
    time: String,
    paid: { type: Boolean, default: false },
    left: { type: Boolean, default: false },
  },
  { timestamps: true },
);
