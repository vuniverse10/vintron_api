import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true
})
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  dateOfBirth: Date;

  @Prop({ 
    required: true,
    unique: true
  })
  mobileNumber: string;

  @Prop()
  weight: number;

  @Prop()
  height: number;

  @Prop()
  stepLength: number;

  @Prop()
  profileUrl: string;  
}

export const UserSchema = SchemaFactory.createForClass(User);