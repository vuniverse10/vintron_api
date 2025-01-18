import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from "@nestjs/common";
import { GoalService } from "../services/goal-settings/goal.service";
import { CreateGoalDto } from "../dto/goal-settings/create-goal.dto";
import { Goal } from "../schemas/goal-settings/goal.schema";

@Controller("goal-settings")
export class GoalSettingsController {
  constructor(private readonly goalService: GoalService) {}

  @Post("create-goal")
  create(@Body() CreateGoalDto: CreateGoalDto): Promise<Goal> {
    return this.goalService.create(CreateGoalDto);
  }
  @Post("bulk-insert-goals")
  async goalBulkInsert(@Body() goals: { title: string }[]): Promise<any> {
    return this.goalService.bulkCreate(goals);
  }

  @Get("fetch-goals")
  async findAll(): Promise<{
    code: number;
    message: string;
    data: { title: string }[];
  }> {
    return this.goalService.fetchGoals();
  }
}
