import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { WorkoutPlanDurationService } from '../services/workout-plan-duration.service';
import { WorkoutPlanDuration } from '../schemas/workout-plan-duration.schema';
import { CreateWorkoutPlanDurationDto } from '../dto/create-workout-plan-duration.dto';

@Controller('workout-plan-duration')
export class WorkoutPlanDurationController {
  constructor(
    private readonly workoutPlanDurationService: WorkoutPlanDurationService,
  ) {}

  @Post()
  async create(
    @Body() CreateWorkoutPlanWeekDto: CreateWorkoutPlanDurationDto,
  ): Promise<WorkoutPlanDuration> {
    return this.workoutPlanDurationService.create(CreateWorkoutPlanWeekDto);
  }

  @Get()
  async findAll() {
    return this.workoutPlanDurationService.fetchWorkPlanDuration();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<WorkoutPlanDuration> {
    return this.workoutPlanDurationService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.workoutPlanDurationService.remove(id);
  }

  @Post('bulk-insert')
  async bulkInsert(
    @Body()
    bulkDataReq: {
      title: string;
      value: string;
      duration: number;
      durationDisplay: string;
    }[],
  ): Promise<any> {
    return this.workoutPlanDurationService.bulkCreate(bulkDataReq);
  }
}
