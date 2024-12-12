import { WithId } from "mongodb";
import * as z from "zod";
import { db } from "../../db";  // Assuming `db` is a configured instance of MongoDB or Mongoose

// Define options for schedule frequency
export const ScheduleFrequency = ["week", "month"] as const;

// Define the fasting diet schema using zod
export const fastingDietSchema = z.object({
  userID: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  planType: z.string(),
  schedule: z.object({
    days: z.array(z.string()),
    frequency: z.enum(ScheduleFrequency)
  }),
  customerStartTimes: z.array(z.string()).optional()
});

// Define the type of fasting diet using the zod schema
export type FastingDiet = z.infer<typeof fastingDietSchema>;

// Define the collection in the database (using MongoDB or Mongoose)
export const fastingDiet = db.collection<FastingDiet>("fasting_diet_list");
