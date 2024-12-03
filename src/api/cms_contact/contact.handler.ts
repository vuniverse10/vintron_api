import { Response, Request, NextFunction } from "express";
import { InsertOneResult, ObjectId } from "mongodb";
import { ZodError } from "zod";
import { ParamsWithId } from "../../interfaces/ParamsWithId";
import { Project, Projects, ProjectWithID } from "./contact.model";
//const { v4: uuidv4 } = require('uuid')
//const insertUUID = uuidv4();
const crypto = require("crypto");
const insertUUID = crypto.randomUUID();
export async function findAll(
  req: Request,
  res: Response<ProjectWithID[]>,
  next: NextFunction
) {
  try {
    const result = await Projects.find().toArray();
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function insertRecord(
  req: Request<{}, ProjectWithID, Project>,
  res: Response,
  next: NextFunction
) {
  try {
    // Check for duplicate title
    const { project_name } = req.body;
    const existingRecord = await Projects.findOne({ project_name });
    if (existingRecord) {
      return res
        .status(409)
        .json({ message: "Duplicate record found with the same title" });
    }
    req.body.uuId = insertUUID;
    const insertResult = await Projects.insertOne(req.body);
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
  req: Request<ParamsWithId, ProjectWithID, {}>,
  res: Response<ProjectWithID>,
  next: NextFunction
) {
  try {
    const result = await Projects.findOne({
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
  req: Request<ParamsWithId, ProjectWithID, Project>,
  res: Response<ProjectWithID>,
  next: NextFunction
) {
  try {
    const updateResult = await Projects.findOneAndUpdate(
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
    const deleteResult = await Projects.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    if (!deleteResult) throw new Error("No records found with this ID");
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

export async function fetchProjectBasedDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await Projects.findOne({
      project_code: req.params.project_code,
    });
    if (!result) {
      res.status(404);
      throw new Error("No records found with this ID");
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
