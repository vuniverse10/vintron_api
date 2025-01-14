import { Schema, Document } from 'mongoose';

export const WorkoutSchema = new Schema({
  video_exercise_title: { type: Schema.Types.Mixed, required: false },
  short_description: { type: Schema.Types.Mixed, required: false },
  category: { type: Schema.Types.Mixed, required: false },
  keywords: { type: Schema.Types.Mixed, required: false },
  reps: { type: Schema.Types.Mixed, required: false },
  reps_break: { type: Schema.Types.Mixed, required: false },
  sets: { type: Schema.Types.Mixed, required: false },
  weights: { type: Schema.Types.Mixed, required: false },
  set_break: { type: Schema.Types.Mixed, required: false },
  equipment: { type: Schema.Types.Mixed, required: false },
  workout_level: { type: Schema.Types.Mixed, required: false },
});

export interface Workout extends Document {
  video_exercise_title?: string | number;
  short_description?: string | number;
  category?: string | number;
  keywords?: string | number;
  reps?: string | number;
  reps_break?: string | number;
  sets?: string | number;
  weights?: string | number;
  set_break?: string | number;
  equipment?: string | number;
  workout_level?: string | number;
}
