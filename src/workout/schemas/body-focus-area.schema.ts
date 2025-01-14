import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class BodyFocusArea extends Document {
  @Prop({ required: true })
  //id: string;
  label: string;
}

export const BodyFocusAreaSchema = SchemaFactory.createForClass(BodyFocusArea);
