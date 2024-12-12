
import { Request, Response } from 'express';
import fastingModel from './fasting.plan.model';
import fastingDiet from './fasting.diet.model';
//import moment from 'moment';


const successResponse = (message: string, data: any = null) => ({
  status: 'success',
  code: 200,
  message,
  data,
});

const errorResponse = (message: string, code: number = 500, errors: any = []) => ({
  status: 'error',
  code,
  message,
  errors,
});

export async function addFastingdiet(req: Request, res: Response, next: NextFunction) {
  const { userID, planType, startTime, endTime, schedule, customerStartTimes } = req.body;

  try {
    const newRecord =await fastingDiet.insertOne(req.body)
    // const newRecord = new fastingDiet({
    //   userID,
    //   planType,
    //   startTime,
    //   endTime,
    //   schedule,
    //   customerStartTimes,
    // });
    // await newRecord.save();
    res.status(201).json(successResponse("Fasting Diet created successfully", newRecord));
  } catch (error) {
    next(error);
  }
}

export async function getFastingdiet(req: Request, res: Response, next: NextFunction) {
  try {
    const records = await fastingDiet.find().toArray();  // Use .toArray() for MongoDB queries to return an array of results

    // If no records are found
    if (records.length === 0) {
      return res.status(404).json(errorResponse("No fasting diets found", 404));
    }
    res.status(200).json(successResponse("Fasting diet details", records));
  } catch (error) {
    next(error);
  }
}

export async function addFastingPlans(req: Request, res: Response, next: NextFunction) {
  const { userID, planType, startTime, endTime, schedule, description, fastHours } = req.body;

  try {
    const newRecord =await fastingModel.insertOne(req.body)
    // const newRecord = new fastingModel({
    //   userID,
    //   planType,
    //   startTime,
    //   endTime,
    //   schedule,
    //   description,
    //   fastHours,
    // });
    // await newRecord.save();
    res.status(201).json(successResponse("Fasting Plan created successfully", newRecord));
  } catch (error) {
    next(error);
  }
}

export async function getFastingPlans(req: Request, res: Response, next: NextFunction) {
  try {
    const records = await fastingModel.find().toArray();
    res.status(200).json(successResponse("Fasting Plans", records));
  } catch (error) {
    next(error);
  }
}

export async function getFastingPlanForImage(req: Request, res: Response, next: NextFunction) {
  try {
    const plans = await fastingModel.find().sort({ _id: -1 }).toArray();
    const filteredPlans = plans.map((plan:any) => ({
      planType: plan.planType,
      imageUrl: plan.imageUrl,
      description: plan.description,
      startTime: plan.startTime,
    }));
    res.status(200).json(successResponse("Fetched fasting plans for image", filteredPlans));
  } catch (error) {
    next(error);
  }
}

export async function addFastingPlanForImage(req: Request, res: Response, next: NextFunction) {
  const { userID, planType, startTime, endTime, schedule, description, fastHours } = req.body;
  const imageUrl = req.file?.path;

  if (!userID || !planType || !startTime || !endTime) {
    res.status(400).json(errorResponse('Missing required fields', 400));
    return;
  }

  try {
    const data = {
      userID, planType, startTime, endTime,imageUrl
    }
    const newPlan = await fastingModel.insertOne(data)
    // const newPlan = new fastingModel({
    //   userID,
    //   planType,
    //   startTime,
    //   endTime,
    //   schedule,
    //   description,
    //   imageUrl,
    //   fastHours,
    // });

    // const savedPlan = await newPlan.save();
    res.status(201).json(successResponse("Plans added", newPlan));
  } catch (error) {
    next(error);
  }
}

export async function getMyPlanWindow(req: Request, res: Response, next: NextFunction) {
  try {
    const planWindow = await fastingDiet.find().sort({ _id: -1 }).toArray();
    const planWindowList = planWindow.map((plan:any) => ({
      customerStartTimes: plan.customerStartTimes,
    }));
    res.status(200).json(successResponse("Fetched plan window", planWindowList));
  } catch (error) {
    next(error);
  }
}

export async function getFastingPlanForEachPlanType(req: Request, res: Response, next: NextFunction) {
  try {
    const planForEachPlanTypeData = await fastingModel.find().sort({ _id: -1 }).toArray();
    const planTypeData = planForEachPlanTypeData.map((plan) => ({
      planType: plan.planType,
      startTime: plan.startTime,
      endTime: plan.endTime,
      fastHours: plan.fastHours,
      content: plan.content,
    }));
    res.status(200).json(successResponse("Fetched fasting plans for each plan type", planTypeData));
  } catch (error) {
    next(error);
  }
}

