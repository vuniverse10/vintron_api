import { WithId } from "mongodb";
import * as z from "zod";
import { db } from "../../db";
export const ModuleOptions = [
  "HEIGHT",
  "WEIGHT",
  "FOOT LENGTH",
  "CALORIES GOAL",
  "DISTANCE GOAL",
  "STEPS GOAL",
  "LITERS",
  "HOURS",
    "MEAL_TYPE"
] as const;
export const Measurement = z.object({
  title: z.string().min(3),
  measurementValue: z.string().min(2),
  units: z.string().min(2),
  measurementSection: z.enum(ModuleOptions),
  created_date: z.date().default(new Date()),
  updated_date: z.date().optional(),
  icon:z.string().optional(),
  userBasedValues: z.string().optional(),
});

export type Measurement = z.infer<typeof Measurement>;
export type MeasurementWithID = WithId<Measurement>;
export const Measurements = db.collection<Measurement>("measurements");
