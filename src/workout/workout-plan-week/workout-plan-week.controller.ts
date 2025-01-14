import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { workoutPlanWeekService } from '../services/workoutPlanWeek.service';
import { WorkoutPlanWeek } from '../schemas/workout-plan-week.schema';
import { CreateWorkoutPlanWeekDto } from '../dto/create-workout-plan-week.dto';

@Controller('workout-plan-week')
export class WorkoutPlanWeekController {
  constructor(
    private readonly workoutPlanWeekService: workoutPlanWeekService,
  ) {}

  @Post()
  async create(
    @Body() CreateWorkoutPlanWeekDto: CreateWorkoutPlanWeekDto,
  ): Promise<WorkoutPlanWeek> {
    return this.workoutPlanWeekService.create(CreateWorkoutPlanWeekDto);
  }

  @Get()
  async findAll() {
    return this.workoutPlanWeekService.fetchWorkoutPlanWeekList();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<WorkoutPlanWeek> {
    return this.workoutPlanWeekService.findOne(id);
  }

  //   @Put(':id')
  //   update(
  //     @Param('id') id: string,
  //     @Body() CreateWorkoutsPreferTimingsDto: CreateWorkoutsPreferTimingsDto,
  //   ): Promise<WorkoutsPreferTimings> {
  //     return this.workoutsPreferTimingsService.update(
  //       id,
  //       CreateWorkoutsPreferTimingsDto,
  //     );
  //   }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.workoutPlanWeekService.remove(id);
  }

  @Post('bulk-insert')
  async bulkInsert(
    @Body() bulkDataReq: { title: string; value: string }[],
  ): Promise<any> {
    return this.workoutPlanWeekService.bulkCreate(bulkDataReq);
  }
}
