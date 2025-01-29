// src/excel-import/excel-import.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ExcelImportService } from "./excel-import.service";
import * as fs from "fs";
import * as path from "path";
import { Express } from "express";

@Controller("excel-import")
export class ExcelImportController {
  constructor(private readonly excelImportService: ExcelImportService) {}

  @Post("import")
  @UseInterceptors(FileInterceptor("file"))
  async importExcel(@UploadedFile() file: Express.Multer.File) {
    try {
      const buffer = file.buffer;

      const importedData = await this.excelImportService.importExcel(buffer);

      return importedData;
    } catch (error) {
      console.error("Error importing Excel file:", error);

      throw new Error(
        "An unexpected error occurred while processing the file."
      );
    }
  }

  @Post("import-plan-objectives")
  @UseInterceptors(FileInterceptor("file"))
  async importPlanObjectivesExcel(@UploadedFile() file: Express.Multer.File) {
    try {
      const buffer = file.buffer;

      const importedData =
        await this.excelImportService.importPlanObjectivesExcel(buffer);

      return importedData;
    } catch (error) {
      console.error("Error importing Excel file:", error);

      throw new Error(
        "An unexpected error occurred while processing the file."
      );
    }
  }

  @Post("import-fasting-packages")
  @UseInterceptors(FileInterceptor("file"))
  async importFastingPackages(@UploadedFile() file: Express.Multer.File) {
    try {
      const buffer = file.buffer;

      const importedData =
        await this.excelImportService.importFastingPackagesExcel(buffer);

      return importedData;
    } catch (error) {
      console.error("Error importing Excel file:", error);

      throw new Error(
        "An unexpected error occurred while processing the file."
      );
    }
  }
}
