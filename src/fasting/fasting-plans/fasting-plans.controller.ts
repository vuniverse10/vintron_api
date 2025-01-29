import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from "@nestjs/common";
import { FastingPlansService } from "../services/fasting-plans.service";
import { FastingPlanDto } from "../dto/fasting-plan.dto";
import { FastingPlan } from "../schemas/fasting-plan.schema";
@Controller("fasting-plans")
export class FastingPlansController {
  constructor(private readonly fastingPlansService: FastingPlansService) {}
  @Post()
  create(@Body() createFastingPlanDto: FastingPlanDto): Promise<FastingPlan> {
    return this.fastingPlansService.create(createFastingPlanDto);
  }

  @Get()
  async findAll(): Promise<{
    code: number;
    message: string;
    data: FastingPlan[];
  }> {
    return this.fastingPlansService.fetchFastingPlans();
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<FastingPlan> {
    return this.fastingPlansService.findOne(id);
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() updateHeightDto: FastingPlanDto
  ): Promise<FastingPlan> {
    return this.fastingPlansService.update(id, updateHeightDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string): Promise<void> {
    return this.fastingPlansService.remove(id);
  }

  @Post("bulk-insert")
  async bulkInsert(@Body() plans: FastingPlan[]): Promise<any> {
    return this.fastingPlansService.bulkCreate(plans);
  }
}
