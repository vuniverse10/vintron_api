import { Injectable } from "@nestjs/common";
import * as XLSX from "xlsx";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Workout } from "./workout.schema";
import { WorkoutPlanObjective } from "./workout-plan-objectives.schema";

@Injectable()
export class ExcelImportService {
  constructor(
    @InjectModel("Workout")
    // @InjectModel("WorkoutPlanObjective")
    private readonly workoutModel: Model<Workout>
    // private readonly WorkoutPlanObjectiveModel: Model<WorkoutPlanObjective>
  ) {}

  async importExcel(fileBuffer: Buffer) {
    try {
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });

      const result: any[] = [];

      workbook.SheetNames.forEach((sheetName) => {
        const cleanSheetName = sheetName
          .replace(/[^a-zA-Z0-9]/g, "_")
          .replace(/\s+/g, "_")
          .toLowerCase();

        const sheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(sheet);

        const transformedData = sheetData.map((row: any) => {
          const cleanedRow: any = {};

          for (const key in row) {
            let cleanedKey = key
              .replace(/[^a-zA-Z0-9]/g, "_")
              .replace(/\s+/g, "_")
              .toLowerCase();

            cleanedKey = cleanedKey.replace(/_+/g, "_");

            cleanedRow[cleanedKey] = row[key];
          }

          cleanedRow.workout_level = cleanSheetName;

          return cleanedRow;
        });

        result.push(...transformedData);
      });

      await this.workoutModel.insertMany(result);

      return {
        message:
          "Data imported successfully into workouts_master_data collection",
      };
    } catch (error) {
      console.error("Error reading Excel file:", error);
      throw new Error("Failed to process Excel file");
    }
  }

  async importPlanObjectivesExcel(fileBuffer: Buffer) {
    try {
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });

      const result: any[] = [];
      const sheetName = workbook.SheetNames[0];
      const cleanSheetName = sheetName
        .replace(/[^a-zA-Z0-9]/g, "_")
        .replace(/\s+/g, "_")
        .toLowerCase();

      const sheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(sheet);

      const transformedData = sheetData.map((row: any) => {
        const cleanedRow: any = {};

        for (const key in row) {
          let cleanedKey = key
            .replace(/[^a-zA-Z0-9]/g, "_")
            .replace(/\s+/g, "_")
            .toLowerCase();

          cleanedKey = cleanedKey.replace(/_+/g, "_");

          cleanedRow[cleanedKey] = row[key];
        }

        // cleanedRow.workout_level = cleanSheetName;

        return cleanedRow;
      });

      result.push(...transformedData);
      return result;

      /* await this.WorkoutPlanObjectiveModel.insertMany(result);

      return {
        message: "Data imported successfully ",
      };*/
    } catch (error) {
      console.error("Error reading Excel file:", error);
      throw new Error("Failed to process Excel file");
    }
  }

  async importFastingPackagesExcel(fileBuffer: Buffer) {
    try {
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });

      const result: any[] = [];
      const sheetName = workbook.SheetNames[0];
      const cleanSheetName = sheetName
        .replace(/[^a-zA-Z0-9]/g, "_")
        .replace(/\s+/g, "_")
        .toLowerCase();

      const sheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(sheet);

      const transformedData = sheetData.map((row: any) => {
        const cleanedRow: any = {};

        for (const key in row) {
          let cleanedKey = key
            .replace(/[^a-zA-Z0-9]/g, "_")
            .replace(/\s+/g, "_")
            .toLowerCase();

          cleanedKey = cleanedKey.replace(/_+/g, "_");

          cleanedRow[cleanedKey] = row[key];
        }

        // cleanedRow.workout_level = cleanSheetName;

        return cleanedRow;
      });

      result.push(...transformedData);
      return result;

      /* await this.WorkoutPlanObjectiveModel.insertMany(result);

      return {
        message: "Data imported successfully ",
      };*/
    } catch (error) {
      console.error("Error reading Excel file:", error);
      throw new Error("Failed to process Excel file");
    }
  }
}
