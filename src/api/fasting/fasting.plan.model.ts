import { WithId } from "mongodb";
import * as z from "zod";
import { db } from "../../db";  // Assuming `db` is a configured instance of MongoDB or Mongoose

// Define options for schedule frequency
export const ScheduleFrequency = ["week", "month"] as const;

// Define the fasting plan schema using zod
export const fastingPlanSchema = z.object({
  userID: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  planType: z.string(),
  schedule: z.object({
    days: z.array(z.string()).optional(),
    frequency: z.enum(ScheduleFrequency).optional(),
  }),
  imageUrl: z.string().optional(),
  description: z.string(),
  fastHours: z.number().default(12),
  content: z.string(),
});

// Define the type of fasting plan using the zod schema
export type FastingPlan = z.infer<typeof fastingPlanSchema>;

// Define the collection in the database (using MongoDB or Mongoose)
export const fastingModel = db.collection<FastingPlan>("fasting_plan_list");
