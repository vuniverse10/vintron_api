import { WithId } from "mongodb";
import * as z from "zod";
import { db } from "../../db";
const numberAndStringSchema = z
  .union([z.string(), z.number()])
  .nullable()
  .optional();

export const Project = z.object({
  project_name: z.string().min(3),
  project_code: z.string().min(2),
  projectLogo: z.string().nullable().optional(),
  projectFavicon: z.string().nullable().optional(),
  slogan: z.string().nullable().optional(),
  emailID: z.string().nullable().optional(),
  mobileNumber: numberAndStringSchema,
  landlineNumber: numberAndStringSchema,
  faxNumber: numberAndStringSchema,
  businessWhatsappNumber: numberAndStringSchema,
  websiteURL: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  googleMapLocation: z.object({
    latitude: numberAndStringSchema,
    longitude: numberAndStringSchema,
    embdedPath: z.string().nullable().optional(),
  }),
  socialMediaLinks: z.string().nullable().optional(),
  supportDetails: z.string().nullable().optional(),
  uuId: z.string().uuid().optional(),
  created_date: z.date().default(new Date()),
  updated_date: z.date().optional(),
  poweredby: z.object({
    name: z.string().nullable().optional(),
    logo: z.string().nullable().optional(),
    website: z.string().nullable().optional(),
  }),
});

export type Project = z.infer<typeof Project>;
export type ProjectWithID = WithId<Project>;
export const Projects = db.collection<Project>("projects");
