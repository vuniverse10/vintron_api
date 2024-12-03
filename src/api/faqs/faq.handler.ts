import { Response, Request, NextFunction } from "express";
import { InsertOneResult, ObjectId } from "mongodb";
import { ZodError } from "zod";
import { ParamsWithId } from "../../interfaces/ParamsWithId";
import { FaqDB, Faq, FaqWithID } from "./faq.model";
import exp from "constants";
export async function findAll(
  req: Request,
  res: Response<FaqWithID[]>,
  next: NextFunction
) {
  try {
    const result = await FaqDB.find().toArray();
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function insertRecord(
  req: Request<{}, FaqWithID, Faq>,
  res: Response<FaqWithID>,
  next: NextFunction
) {
  try {
    const insertResult = await FaqDB.insertOne(req.body);
    if (!insertResult.acknowledged) throw new Error("Insert Failed");
    res.status(201);
    res.json({
      _id: insertResult.insertedId,
      ...req.body,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(422);
    }
    next(error);
  }
}

export async function getRecord(
  req: Request<ParamsWithId, FaqWithID, {}>,
  res: Response<FaqWithID>,
  next: NextFunction
) {
  try {
    const result = await FaqDB.findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!result) {
      res.status(404);
      throw new Error("No records found with this ID");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateRecord(
  req: Request<ParamsWithId, FaqWithID, Faq>,
  res: Response<FaqWithID>,
  next: NextFunction
) {
  try {
    const updateResult = await FaqDB.findOneAndUpdate(
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
    if (!updateResult.value) throw new Error("No records found with this ID");
    res.json(updateResult.value);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(422);
    }
    next(error);
  }
}

export async function deleteRecord(
  req: Request<ParamsWithId, {}, {}>,
  res: Response<{}>,
  next: NextFunction
) {
  try {
    const deleteResult = await FaqDB.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    if (!deleteResult) throw new Error("No records found with this ID");
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
