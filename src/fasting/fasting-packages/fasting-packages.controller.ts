import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from "@nestjs/common";

import { FastingPackagesService } from "../services/fasting-packages/fasting-packages.service";
import { FastingPackagesDto } from "../dto/fasting-packages.dto";
import { FastingPackages } from "../schemas/fasting-packages.schema";

@Controller("fasting-packages")
export class FastingPackagesController {
  constructor(
    private readonly fastingPackagesService: FastingPackagesService
  ) {}

  @Get()
  async findAll(): Promise<{
    code: number;
    message: string;
    data: FastingPackages[];
  }> {
    return this.fastingPackagesService.fetchFastingPlans();
  }

  @Post("bulk-insert")
  async bulkInsert(@Body() packages: FastingPackages[]): Promise<any> {
    try {
      return this.fastingPackagesService.bulkCreate(packages);
    } catch (err) {
      console.error("Error in bulkInsert", err);
      return { error: "Failed to insert bulk data" };
    }
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<{
    code: number;
    message: string;
    data: any;
  }> {
    return this.fastingPackagesService.findOne(id);
  }
}
