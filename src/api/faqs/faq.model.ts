import { WithId } from "mongodb";
import * as z from "zod";
import { db } from "../../db";

const titleSchema = z.union([z.string().min(3), z.number().transform(String)]);
const numberAndStringSchema = z
  .union([z.string(), z.number()])
  .nullable()
  .optional();
export const Faq = z.object({
  title: titleSchema,
  category: titleSchema,
  status: z.boolean().default(true),
  position: z.number().default(1),
  short_description: z.string().optional(),
  long_description: z.string().optional(),
  created_date: z.date().default(new Date()),
  updated_date: z.date().optional(),
});

export type Faq = z.infer<typeof Faq>;
export type FaqWithID = WithId<Faq>;
export const FaqDB = db.collection<Faq>("faqs");
