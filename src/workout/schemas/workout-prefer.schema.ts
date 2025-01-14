import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class WorkoutPrefer extends Document {
  @Prop({ required: true })
  //id: string;
  label: string;
}

export const WorkoutPreferSchema = SchemaFactory.createForClass(WorkoutPrefer);
