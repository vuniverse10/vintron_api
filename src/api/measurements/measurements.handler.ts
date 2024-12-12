import { Response, Request, NextFunction } from "express";
import { InsertOneResult, ObjectId } from "mongodb";
import { ZodError } from "zod";
import { ParamsWithId } from "../../interfaces/ParamsWithId";
import {
  Measurements,
  Measurement,
  MeasurementWithID,
  ModuleOptions,
} from "./measurements.model";

type MeasurementSection =
  | "HEIGHT"
  | "WEIGHT"
  | "FOOT LENGTH"
  | "CALORIES GOAL"
  | "DISTANCE GOAL"
  | "STEPS GOAL"
  | "LITERS"
    | "MEAL_TYPE"
  | "HOURS";

const successResponse = (message: string, data: any = null) => ({
  status: "success",
  code: 200,
  message,
  data,
});

const errorResponse = (
  message: string,
  code: number = 500,
  errors: any = []
) => ({
  status: "error",
  code,
  message,
  errors,
});

export async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await Measurements.find().toArray();
    res.json(successResponse("Fetched all records successfully", result));
  } catch (error) {
    next(error);
  }
}

export async function insertRecord(
  req: Request<{}, MeasurementWithID, Measurement>,
  res: Response,
  next: NextFunction
) {
  try {
    const { measurementValue, measurementSection } = req.body;
    const existingRecord = await Measurements.findOne({
      measurementValue,
      measurementSection,
    });

    if (existingRecord) {
      return res
        .status(409)
        .json(errorResponse("Duplicate record found with the same title", 409));
    }

    const insertResult = await Measurements.insertOne(req.body);
    if (!insertResult.acknowledged) {
      return res
        .status(400)
        .json(errorResponse(`Unable to create ${measurementValue}`, 400));
    }

    return res
      .status(201)
      .json(successResponse(`${measurementValue} created successfully`));
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(422)
        .json(errorResponse("Validation error", 422, error.errors));
    }
    next(error);
  }
}

export async function getRecord(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await Measurements.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!result) {
      return res.status(404).json(errorResponse("No records found", 404));
    }

    return res
      .status(200)
      .json(successResponse("Fetching record details", result));
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse("Server error", 500, [error.message]));
  }
}

export async function updateRecord(
  req: Request<ParamsWithId, MeasurementWithID, Measurement>,
  res: Response,
  next: NextFunction
) {
  try {
    const updateResult = await Measurements.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
      },
      {
        $set: req.body,
      },
      {
        returnDocument: "after",
      }
    );

    if (!updateResult.value) {
      return res
        .status(404)
        .json(errorResponse("No records found with this ID", 404));
    }

    return res
      .status(200)
      .json(successResponse("Record updated successfully", updateResult.value));
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(422)
        .json(errorResponse("Validation error", 422, error.errors));
    }
    next(error);
  }
}

export async function deleteRecord(
  req: Request<ParamsWithId, {}, {}>,
  res: Response,
  next: NextFunction
) {
  try {
    const deleteResult = await Measurements.deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (!deleteResult.deletedCount) {
      return res
        .status(404)
        .json(errorResponse("No records found with this ID", 404));
    }

    return res.status(204).json(successResponse("Record deleted successfully"));
  } catch (error) {
    next(error);
  }
}

export async function sectionBasedMeasurements(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const section = req.params.sectionBasedFilter;
    const result = await Measurements.find({
      measurementSection: section as MeasurementSection,
    }).toArray();

    return res
      .status(200)
      .json(successResponse("Fetched records by section", result));
  } catch (error) {
    next(error);
  }
}
