import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from "@nestjs/common";

import { HealthRestrictionsService } from "../services/goal-settings/health-restrictions.service";
import { CreateHealRestrictionsDto } from "../dto/goal-settings/create-healh-restrictions.dto";
import { HealthRestrictions } from "../schemas/goal-settings/health-restrictions.schema";
@Controller("heal-restrictions")
export class HealRestrictionsController {
  constructor(private readonly hrService: HealthRestrictionsService) {}

  @Post()
  create(
    @Body() CreateHealRestrictionsDto: CreateHealRestrictionsDto
  ): Promise<HealthRestrictions> {
    return this.hrService.create(CreateHealRestrictionsDto);
  }

  @Post("bulk-insert")
  async goalBulkInsert(@Body() goals: { title: string }[]): Promise<any> {
    return this.hrService.bulkCreate(goals);
  }

  @Get()
  async findAll(): Promise<{
    code: number;
    message: string;
    data: { title: string }[];
  }> {
    return this.hrService.fetchHealthRestrictions();
  }

  @Delete(":id")
  remove(@Param("id") id: string): Promise<void> {
    return this.hrService.remove(id);
  }
}
