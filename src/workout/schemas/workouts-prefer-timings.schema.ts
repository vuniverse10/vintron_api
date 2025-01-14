import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class WorkoutsPreferTimings extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  value: string;

  @Prop({ type: [String], required: true })
  slots: string[];
}

export const WorkoutsPreferTimingsSchema = SchemaFactory.createForClass(
  WorkoutsPreferTimings,
);
