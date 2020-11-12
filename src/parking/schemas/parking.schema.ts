import { Schema, Document } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';

export class Parking extends Document {
  plate: string;
  uuid: string;
  time: string;
  paid: boolean;
  left: boolean;
  createdAt?: Date;
}

export const ParkingSchema = new Schema(
  {
    plate: String,
    uuid: { type: String, default: uuidV4() },
    paid: { type: Boolean, default: false },
    left: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc: Parking, ret: Parking) => {
        const currentTime = new Date();
        const runningTime = Math.round(
          (currentTime.getTime() - doc.createdAt?.getTime()) / 1000 / 60,
        );

        ret.time = `${runningTime} minutes`;
      },
    },
  },
);
