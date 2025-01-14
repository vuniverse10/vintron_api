import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { WorkoutPreferService } from '../services/workout-prefer.service';
import { WorkoutPrefer } from '../schemas/workout-prefer.schema';
import { CreateWorkoutPreferDto } from '../dto/create-workout-prefer.dto';

@Controller('workout-prefer')
export class WorkoutPreferController {
  constructor(private readonly workoutPreferService: WorkoutPreferService) {}

  @Post()
  async create(
    @Body() CreateWorkoutPreferDto: CreateWorkoutPreferDto,
  ): Promise<WorkoutPrefer> {
    return this.workoutPreferService.create(CreateWorkoutPreferDto);
  }

  @Get()
  async findAll() {
    return this.workoutPreferService.fetchWorkoutPreferList();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<WorkoutPrefer> {
    return this.workoutPreferService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() UpdateBodyFocusAreaDto: CreateWorkoutPreferDto,
  ): Promise<WorkoutPrefer> {
    return this.workoutPreferService.update(id, UpdateBodyFocusAreaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.workoutPreferService.remove(id);
  }

  @Post('bulk-insert')
  async bulkInsert(@Body() bulkDataReq: { label: string }[]): Promise<any> {
    console.log(bulkDataReq);
    return this.workoutPreferService.bulkCreate(bulkDataReq);
  }
}
