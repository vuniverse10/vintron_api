import { Schema, Document } from 'mongoose';

export interface PersonalTraining extends Document {
  // Your schema fields here
  label: string;
  value: string;
}

export const PersonalTrainingSchema = new Schema<PersonalTraining>({
  label: { type: String, required: true },
  value: { type: String, required: true },
});
